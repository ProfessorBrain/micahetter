#!/usr/bin/env python3
"""Import the supplied NeurAnki APKG using Python stdlib and Node.js 24+.

Usage: python scripts/import_deck.py SOURCE.apkg --node /path/to/node
The original package is read only. Anki template JavaScript is never executed.
"""

from __future__ import annotations

import argparse
import collections
import hashlib
import html
import json
from pathlib import Path
import re
import sqlite3
import subprocess
import tempfile
import unicodedata
from urllib.parse import unquote, urlsplit
import zipfile


ZSTD_MAGIC = b"\x28\xb5\x2f\xfd"
DECOMPRESS_JS = """
const fs = require('node:fs');
const zlib = require('node:zlib');
const data = fs.readFileSync(0);
process.stdout.write(zlib.zstdDecompressSync(data));
"""
MEDIA_JS = """
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const manifest = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));
for (const item of manifest) {
  const input = fs.readFileSync(item.source);
  const data = input.subarray(0, 4).equals(Buffer.from([0x28, 0xb5, 0x2f, 0xfd]))
    ? zlib.zstdDecompressSync(input) : input;
  fs.writeFileSync(item.target, data);
}
"""
SRC_RE = re.compile(r"(\bsrc\s*=\s*)([\"'])(.*?)\2", re.IGNORECASE | re.DOTALL)
UNQUOTED_SRC_RE = re.compile(r"(\bsrc\s*=\s*)(?![\"'])([^\s>]+)", re.IGNORECASE)


def decompress(data: bytes, node: str) -> bytes:
    if not data.startswith(ZSTD_MAGIC):
        return data
    return subprocess.run(
        [node, "-e", DECOMPRESS_JS], input=data, capture_output=True, check=True
    ).stdout


def varint(data: bytes, pos: int) -> tuple[int, int]:
    value = shift = 0
    while pos < len(data) and shift < 70:
        byte = data[pos]
        pos += 1
        value |= (byte & 127) << shift
        if byte < 128:
            return value, pos
        shift += 7
    raise ValueError("Invalid protobuf varint")


def protobuf_fields(data: bytes):
    pos = 0
    while pos < len(data):
        key, pos = varint(data, pos)
        field, wire = key >> 3, key & 7
        if wire == 0:
            value, pos = varint(data, pos)
        elif wire in (1, 5):
            size = 8 if wire == 1 else 4
            value = data[pos : pos + size]
            pos += size
        elif wire == 2:
            size, pos = varint(data, pos)
            value = data[pos : pos + size]
            if len(value) != size:
                raise ValueError("Truncated protobuf field")
            pos += size
        else:
            raise ValueError(f"Unsupported protobuf wire type: {wire}")
        yield field, wire, value


def media_entries(data: bytes) -> list[dict]:
    if data.lstrip().startswith(b"{"):
        mapping = json.loads(data)
        return [{"index": index, "name": name} for index, name in mapping.items()]
    result = []
    for field, wire, value in protobuf_fields(data):
        if field != 1 or wire != 2:
            continue
        entry = {f: v for f, _, v in protobuf_fields(value)}
        result.append(
            {
                "index": str(len(result)),
                "name": entry[1].decode("utf-8"),
                "size": entry.get(2),
                "sha1": entry[3].hex() if 3 in entry else None,
            }
        )
    return result


def safe_extension(name: str) -> str:
    extension = Path(name).suffix.lower()
    # This source uses .jpglarge for two JPEG images. Browser-friendly names
    # preserve the original asset bytes.
    if extension == ".jpglarge":
        return ".jpg"
    return extension if re.fullmatch(r"\.[a-z0-9]{1,10}", extension) else ".bin"


def safe_media_name(index: str, original_name: str) -> str:
    if not re.fullmatch(r"[0-9]+", index):
        raise ValueError("Media archive indices must be nonnegative integers")
    return f"{int(index):04d}{safe_extension(original_name)}"


def cloze_indices(value: str) -> list[int]:
    """Find complete deletions using the renderer's nested-cloze semantics.

    An unmatched deletion must not become reviewable solely because its opening
    marker exists. Valid sibling deletions remain usable. Hints do not create
    independent cards.
    """
    opener = re.compile(r"{{c([1-9]\d*)::", re.IGNORECASE)

    def parse_range(start: int, nested: bool, depth: int, allow_hint: bool = True):
        found = set()
        pos = start
        while pos < len(value):
            if nested and value.startswith("}}", pos):
                return found, pos + 2, True
            if nested and allow_hint and value.startswith("::", pos):
                _, end, closed = parse_range(pos + 2, True, depth, False)
                return found, end, closed
            match = opener.match(value, pos)
            if match and depth < 40:
                children, end, closed = parse_range(match.end(), True, depth + 1)
                if closed:
                    found.add(int(match[1]))
                    found.update(children)
                    pos = end
                    continue
            pos += 1
        return found, pos, not nested

    return sorted(parse_range(0, False, 0)[0])


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def import_deck(source: Path, output: Path, node: str) -> dict:
    output.mkdir(parents=True, exist_ok=True)
    data_dir, media_dir = output / "data", output / "media"
    data_dir.mkdir(exist_ok=True)
    media_dir.mkdir(exist_ok=True)
    missing_refs: list[dict] = []
    remote_refs: list[dict] = []
    cloze_anomalies: list[dict] = []

    with zipfile.ZipFile(source) as archive, tempfile.TemporaryDirectory(prefix="neuranki-import-") as temporary:
        scratch = Path(temporary)
        collection_name = next(
            name for name in ("collection.anki21b", "collection.anki21", "collection.anki2")
            if name in archive.namelist()
        )
        db_path = scratch / "collection.db"
        db_path.write_bytes(decompress(archive.read(collection_name), node))
        entries = media_entries(decompress(archive.read("media"), node))
        media_map = {}
        conversion = []
        for entry in entries:
            safe_name = safe_media_name(entry["index"], entry["name"])
            entry["output"] = "media/" + safe_name
            media_map[unicodedata.normalize("NFC", entry["name"])] = entry["output"]
            compressed_path = scratch / entry["index"]
            compressed_path.write_bytes(archive.read(entry["index"]))
            conversion.append({"source": str(compressed_path), "target": str(media_dir / safe_name)})
        job_path = scratch / "media-jobs.json"
        job_path.write_text(json.dumps(conversion), encoding="utf-8")
        subprocess.run([node, "-e", MEDIA_JS, str(job_path)], check=True, capture_output=True)

        total_media_bytes = 0
        for entry in entries:
            payload = (output / entry["output"]).read_bytes()
            total_media_bytes += len(payload)
            if entry.get("size") is not None and len(payload) != entry["size"]:
                raise ValueError(f"Media length mismatch: {entry['index']}")
            if entry.get("sha1") and hashlib.sha1(payload).hexdigest() != entry["sha1"]:
                raise ValueError(f"Media checksum mismatch: {entry['index']}")

        def rewrite_reference(ref: str, note_id: str, field_name: str) -> str:
            decoded = html.unescape(ref).strip()
            parsed = urlsplit(decoded)
            if parsed.scheme or decoded.startswith("//"):
                remote_refs.append({"noteId": note_id, "field": field_name, "src": ref})
                return ref
            candidates = [decoded, unquote(decoded)]
            for candidate in candidates:
                normalized = unicodedata.normalize("NFC", candidate)
                if normalized in media_map:
                    return media_map[normalized]
            missing_refs.append({"noteId": note_id, "field": field_name, "src": ref})
            return ref

        def rewrite_html(value: str, note_id: str, field_name: str) -> str:
            value = SRC_RE.sub(
                lambda m: m[1] + m[2] + rewrite_reference(m[3], note_id, field_name) + m[2], value
            )
            # Existing quoted attributes cannot match this second pass.
            return UNQUOTED_SRC_RE.sub(
                lambda m: m[1] + rewrite_reference(m[2], note_id, field_name), value
            )

        connection = sqlite3.connect(db_path.as_uri() + "?mode=ro", uri=True)
        connection.create_collation("unicase", lambda a, b: (a.casefold() > b.casefold()) - (a.casefold() < b.casefold()))
        models = {}
        for model_id, name in connection.execute("SELECT id,name FROM notetypes ORDER BY id"):
            fields = [row[0] for row in connection.execute("SELECT name FROM fields WHERE ntid=? ORDER BY ord", (model_id,))]
            kind = "occlusion" if "Question Mask" in fields and "Answer Mask" in fields else "cloze" if "Text" in fields and "cloze" in name.lower() else "other"
            models[str(model_id)] = {"name": name, "fields": fields, "type": kind}
        notes = {}
        for note_id, model_id, fields, tags in connection.execute("SELECT id,mid,flds,tags FROM notes ORDER BY id"):
            note_id, model_id = str(note_id), str(model_id)
            field_names = models[model_id]["fields"]
            values = fields.split("\x1f")
            notes[note_id] = {
                "id": note_id,
                "modelId": model_id,
                "fields": [rewrite_html(value, note_id, field_names[index]) for index, value in enumerate(values)],
                "tags": tags.split(),
            }
        cards = [
            {"id": str(card_id), "noteId": str(note_id), "deckId": str(deck_id), "ordinal": ordinal}
            for card_id, note_id, deck_id, ordinal in connection.execute("SELECT id,nid,did,ord FROM cards ORDER BY id")
        ]
        active_decks = {card["deckId"] for card in cards}
        decks = [
            {"id": str(deck_id), "name": name.replace("\x1f", "::")}
            for deck_id, name in connection.execute("SELECT id,name FROM decks ORDER BY name")
            if str(deck_id) in active_decks
        ]
        for card in cards:
            note = notes[card["noteId"]]
            if models[note["modelId"]]["type"] == "cloze":
                indices = cloze_indices(note["fields"][0])
                if card["ordinal"] + 1 not in indices:
                    card["issue"] = f"Source card requests cloze c{card['ordinal'] + 1}, but its matching deletion is missing or malformed."
                    cloze_anomalies.append({"cardId": card["id"], "noteId": note["id"], "ordinal": card["ordinal"], "availableClozeIndices": indices})
        deck = {"id": "neuranki-v1", "name": "NeurAnki", "decks": decks, "models": models, "notes": notes, "cards": cards, "mediaCount": len(entries)}
        schedule = [
            {"type": kind, "queue": queue, "cardCount": count, "totalReviews": reps}
            for kind, queue, count, reps in connection.execute("SELECT type,queue,count(*),sum(reps) FROM cards GROUP BY type,queue")
        ]
        report = {
            "sourceFile": source.name,
            "packageSha256": sha256_file(source),
            "collectionEntry": collection_name,
            "noteCount": len(notes), "cardCount": len(cards), "deckCount": len(decks),
            "mediaCount": len(entries), "mediaBytes": total_media_bytes,
            "mediaChecksumsVerified": True,
            "mediaExtensions": dict(sorted(collections.Counter(Path(e["name"]).suffix.lower() for e in entries).items())),
            "models": [
                {"id": model_id, **model,
                 "noteCount": sum(note["modelId"] == model_id for note in notes.values()),
                 "cardCount": sum(notes[card["noteId"]]["modelId"] == model_id for card in cards)}
                for model_id, model in models.items()
            ],
            "decks": [{**deck, "cardCount": sum(card["deckId"] == deck["id"] for card in cards)} for deck in decks],
            "missingMediaReferences": missing_refs,
            "missingMediaReferenceCount": len(missing_refs),
            "remoteMediaReferences": remote_refs,
            "remoteMediaReferenceCount": len(remote_refs),
            "clozeAnomalies": cloze_anomalies,
            "clozeAnomalyCount": len(cloze_anomalies),
            "sourceScheduling": schedule,
            "sourceReviewLogCount": connection.execute("SELECT count(*) FROM revlog").fetchone()[0],
            "media": entries,
        }
        connection.close()
        (data_dir / "deck.json").write_text(json.dumps(deck, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        (data_dir / "import-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return {key: report[key] for key in ("noteCount", "cardCount", "deckCount", "mediaCount", "mediaBytes")} | {"missingMediaReferences": len(missing_refs), "clozeAnomalies": len(cloze_anomalies)}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--node", default="node", help="Node.js 24+ executable with zstd support")
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    print(json.dumps(import_deck(args.source.resolve(), args.output.resolve(), args.node), indent=2))

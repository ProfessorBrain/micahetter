"""Run with: python -m unittest discover -s tests -p 'test_*.py'."""

import hashlib
import importlib.util
import json
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("import_deck", ROOT / "scripts" / "import_deck.py")
importer = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(importer)


def encode_varint(value):
    result = bytearray()
    while value >= 128:
        result.append((value & 127) | 128)
        value >>= 7
    result.append(value)
    return bytes(result)


def string_field(number, value):
    return encode_varint((number << 3) | 2) + encode_varint(len(value)) + value


class ImportParserTests(unittest.TestCase):
    def test_modern_media_manifest_preserves_filename_size_and_digest(self):
        filename = "image-α.jpg".encode("utf-8")
        digest = bytes(range(20))
        entry = string_field(1, filename) + b"\x10" + encode_varint(320218) + string_field(3, digest)
        parsed = importer.media_entries(string_field(1, entry))
        self.assertEqual(parsed, [{"index": "0", "name": "image-α.jpg", "size": 320218, "sha1": digest.hex()}])

    def test_truncated_manifest_is_rejected(self):
        with self.assertRaises(ValueError):
            importer.media_entries(b"\x0a\x07abc")
        with self.assertRaises(ValueError):
            importer.varint(b"\x80", 0)

    def test_original_filenames_cannot_escape_media_directory(self):
        for original in ["../../outside.png", r"C:\outside.png", "//host/share/outside.png"]:
            result = importer.safe_media_name("42", original)
            self.assertEqual(result, "0042.png")
            self.assertEqual(Path(result).name, result)
        for index in ["../0", "0/../x", "-1", r"..\0", ""]:
            with self.assertRaises(ValueError):
                importer.safe_media_name(index, "image.png")
        self.assertEqual(importer.safe_media_name("1", "scan.jpglarge"), "0001.jpg")
        self.assertEqual(importer.safe_media_name("2", "file.bad-extension"), "0002.bin")

    def test_cloze_parser_requires_complete_target_but_keeps_valid_siblings(self):
        malformed = "The {{c1::<b>ulnar}</b>} nerve follows the {{c2::<b>medial</b>}} cord"
        self.assertEqual(importer.cloze_indices(malformed), [2])
        self.assertEqual(importer.cloze_indices("{{<b>c1::answer</b>}} and {{c2::valid}}"), [2])
        self.assertEqual(importer.cloze_indices("{{c31::one}} {{c1::two::hint}}"), [1, 31])

    def test_nested_clozes_and_hints(self):
        self.assertEqual(importer.cloze_indices("{{c1::outer {{c2::inner}} text::hint}}"), [1, 2])
        self.assertEqual(importer.cloze_indices("{{c1::answer::{{c3::hint only}}}}"), [1])
        self.assertEqual(importer.cloze_indices("{{c1::unclosed"), [])


@unittest.skipUnless((ROOT / "data" / "deck.json").exists(), "Run importer before corpus verification")
class ExportIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.deck = json.loads((ROOT / "data" / "deck.json").read_text(encoding="utf-8"))
        cls.report = json.loads((ROOT / "data" / "import-report.json").read_text(encoding="utf-8"))

    def test_source_inventory_and_card_relationships(self):
        self.assertEqual(len(self.deck["notes"]), 2973)
        self.assertEqual(len(self.deck["cards"]), 5185)
        self.assertEqual(len(self.deck["decks"]), 13)
        self.assertEqual(self.deck["mediaCount"], 762)
        deck_ids = {deck["id"] for deck in self.deck["decks"]}
        card_ids = set()
        for card in self.deck["cards"]:
            self.assertIsInstance(card["id"], str)
            self.assertNotIn(card["id"], card_ids)
            card_ids.add(card["id"])
            self.assertIn(card["deckId"], deck_ids)
            self.assertIn(card["noteId"], self.deck["notes"])
        for note in self.deck["notes"].values():
            self.assertEqual(len(note["fields"]), len(self.deck["models"][note["modelId"]]["fields"]))

    def test_only_unrenderable_target_cards_have_source_issue(self):
        issue_ids = set()
        for card in self.deck["cards"]:
            note = self.deck["notes"][card["noteId"]]
            if self.deck["models"][note["modelId"]]["type"] != "cloze":
                self.assertFalse(card.get("issue"))
                continue
            complete = card["ordinal"] + 1 in importer.cloze_indices(note["fields"][0])
            self.assertEqual(bool(card.get("issue")), not complete, card["id"])
            if card.get("issue"):
                issue_ids.add(card["id"])
        self.assertEqual(len(issue_ids), 107)
        self.assertEqual(issue_ids, {row["cardId"] for row in self.report["clozeAnomalies"]})
        self.assertEqual(self.report["clozeAnomalyCount"], 107)

    def test_every_asset_matches_original_manifest(self):
        outputs = set()
        media_root = (ROOT / "media").resolve()
        for entry in self.report["media"]:
            path = (ROOT / entry["output"]).resolve()
            self.assertTrue(path.is_relative_to(media_root))
            self.assertNotIn(entry["output"], outputs)
            outputs.add(entry["output"])
            payload = path.read_bytes()
            self.assertEqual(len(payload), entry["size"], entry["output"])
            self.assertEqual(hashlib.sha1(payload).hexdigest(), entry["sha1"], entry["output"])
        self.assertEqual(len(outputs), 762)

    def test_all_local_image_references_resolve_and_remote_refs_are_reported(self):
        remote = []
        for note in self.deck["notes"].values():
            for field in note["fields"]:
                for match in importer.SRC_RE.finditer(field):
                    source = match[3]
                    if source.startswith("https://"):
                        remote.append(source)
                    else:
                        self.assertRegex(source, r"^media/[0-9]+\.[a-z0-9]+$")
                        self.assertTrue((ROOT / source).is_file(), source)
        self.assertEqual(len(remote), 35)
        self.assertEqual(self.report["remoteMediaReferenceCount"], len(remote))
        self.assertEqual(self.report["missingMediaReferenceCount"], 0)


if __name__ == "__main__":
    unittest.main()

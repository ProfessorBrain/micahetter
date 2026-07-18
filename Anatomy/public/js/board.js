const contexts = {
  whole: `
    <circle class="anatomy-context" cx="50" cy="10" r="7"/><path class="anatomy-context" d="M42 19 Q50 16 58 19 L62 47 Q58 58 56 62 L61 94 Q57 98 53 94 L50 61 L47 94 Q43 98 39 94 L44 61 Q40 56 38 47 Z"/>
    <path class="anatomy-context" d="M42 22 Q34 28 26 49 Q24 54 28 56 Q31 56 34 49 L43 32 M58 22 Q66 28 74 49 Q76 54 72 56 Q69 56 66 49 L57 32"/>
    <path class="anatomy-detail" d="M50 18 L50 60 M41 36 L59 36 M42 48 L58 48"/>`,
  face: `<ellipse class="anatomy-context" cx="50" cy="50" rx="27" ry="38"/><path class="anatomy-detail" d="M34 42 Q41 37 46 42 M54 42 Q59 37 66 42 M50 42 L47 57 L53 57 M39 68 Q50 75 61 68 M29 31 Q20 37 24 52 M71 31 Q80 37 76 52"/><circle class="anatomy-detail" cx="40" cy="43" r="2.2"/><circle class="anatomy-detail" cx="60" cy="43" r="2.2"/><path class="anatomy-context" d="M62 31 Q75 37 72 55 Q68 68 59 65 Q65 52 62 31Z"/>`,
  limb: `<path class="anatomy-context" d="M43 7 Q50 2 57 7 L62 36 Q65 49 60 60 L56 91 Q54 98 48 96 L44 61 Q38 51 40 37Z"/><path class="anatomy-detail" d="M50 10 L51 43 M49 47 L48 89 M54 47 L56 88"/><ellipse class="anatomy-detail" cx="51" cy="45" rx="9" ry="7"/>`,
  joint: `<path class="anatomy-context" d="M35 3 Q50 -1 64 5 L59 38 Q56 45 62 51 L71 95 L57 97 L49 57 L44 96 L31 93 L39 50 Q44 44 41 36Z"/><path class="anatomy-detail" d="M43 5 L48 39 Q48 46 43 53 L38 91 M57 5 L52 39 Q52 46 58 53 L64 92"/><ellipse class="anatomy-detail" cx="50" cy="46" rx="14" ry="10"/>`,
  back: `<path class="anatomy-context" d="M32 14 Q50 3 68 14 L72 62 Q67 79 63 94 L52 96 L50 65 L48 96 L37 94 Q33 79 28 62Z"/><path class="anatomy-detail" d="M50 9 L50 90 M34 23 Q50 36 66 23 M31 45 Q50 58 69 45 M38 14 L50 34 L62 14"/><circle class="anatomy-detail" cx="50" cy="18" r="11"/>`,
  brain: `<path class="anatomy-context" d="M23 48 Q19 31 31 18 Q43 5 58 12 Q75 13 80 32 Q86 48 74 62 Q66 74 49 70 Q33 75 24 62 Q16 58 23 48Z"/><path class="anatomy-detail" d="M27 35 Q39 27 48 35 Q58 21 72 33 M24 50 Q39 43 50 50 Q62 39 78 48 M32 62 Q43 53 52 62 Q61 53 71 59 M50 15 L50 69"/><path class="anatomy-context" d="M45 68 Q50 77 55 68 L58 94 L43 94Z"/>`,
  thorax: `<path class="anatomy-context" d="M31 9 Q50 2 69 9 L78 67 Q67 86 50 93 Q33 86 22 67Z"/><path class="anatomy-detail" d="M50 9 L50 88 M33 20 Q50 30 67 20 M28 32 Q50 44 72 32 M25 45 Q50 58 75 45 M25 58 Q50 72 75 58"/><path class="anatomy-context" d="M45 24 Q29 18 28 46 Q30 68 45 72Z M55 24 Q71 18 72 46 Q70 68 55 72Z"/>`,
  abdomen: `<path class="anatomy-context" d="M31 7 Q50 2 69 7 L73 78 Q64 96 50 97 Q36 96 27 78Z"/><path class="anatomy-detail" d="M30 28 Q50 36 70 28 M27 54 Q50 62 73 54 M50 8 L50 92"/><path class="anatomy-context" d="M31 20 Q49 13 66 25 Q64 39 53 42 Q39 43 30 35Z"/><path class="anatomy-detail" d="M37 53 Q29 62 38 76 Q50 86 62 76 Q71 62 63 53"/>`,
  pelvis: `<path class="anatomy-context" d="M27 14 Q50 4 73 14 L67 58 Q62 80 50 93 Q38 80 33 58Z"/><path class="anatomy-detail" d="M30 25 Q50 43 70 25 M34 48 Q50 67 66 48 M50 10 L50 88"/><ellipse class="anatomy-context" cx="50" cy="68" rx="15" ry="13"/>`
};

function zoneMarkup(zone) {
  return `<g class="zone-group"><rect class="zoom-zone${zone.wrong ? " wrong" : ""}" data-zone="${zone.id}" x="${zone.x}" y="${zone.y}" width="${zone.w}" height="${zone.h}" rx="3" tabindex="0" role="button" aria-label="Zoom to ${zone.label}"/><text class="zone-label" x="${zone.x + 1.5}" y="${zone.y + 4}">${zone.id}</text></g>`;
}

function targetMarkup(structure) {
  if (!structure) return "";
  const { x, y, radius } = structure.target;
  if (structure.pieceType === "pathway") return `<rect class="target-silhouette" x="${x - radius * 1.8}" y="${y - radius * .35}" width="${radius * 3.6}" height="${radius * .7}" rx="3" transform="rotate(${structure.idealRotation ?? 0} ${x} ${y})"/>`;
  if (structure.pieceType === "muscle") return `<ellipse class="target-silhouette" cx="${x}" cy="${y}" rx="${radius * .62}" ry="${radius * 1.45}" transform="rotate(${structure.idealRotation ?? 0} ${x} ${y})"/>`;
  return `<path class="target-silhouette" d="M ${x} ${y-radius} C ${x+radius} ${y-radius}, ${x+radius*1.15} ${y+radius*.55}, ${x} ${y+radius} C ${x-radius} ${y+radius*.55}, ${x-radius*1.1} ${y-radius*.35}, ${x} ${y-radius}Z"/>`;
}

export function normalizedPoint(event, svg) {
  const rect = svg.getBoundingClientRect();
  return { x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)), y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)) };
}

export function renderBoard(container, board, structure, options = {}) {
  const zones = board?.zoomZones ?? [];
  container.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="group" aria-label="${board?.label ?? "Anatomy board"}"><g class="context-art">${contexts[board?.kind] ?? contexts.joint}</g>${zones.map(zoneMarkup).join("")}<g class="debug-target">${targetMarkup(structure)}</g><g id="authoring-layer"></g></svg>`;
  const svg = container.querySelector("svg");
  container.classList.toggle("debug-on", Boolean(options.debug));
  svg.querySelectorAll("[data-zone]").forEach((node) => {
    const enter = () => options.onZone?.(node.dataset.zone);
    node.addEventListener("click", (event) => { event.stopPropagation(); enter(); });
    node.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); enter(); } });
    node.addEventListener("dragover", (event) => event.preventDefault());
    node.addEventListener("drop", (event) => { event.preventDefault(); options.onDropZone?.(node.dataset.zone, event.dataTransfer?.getData("text/plain")); });
  });
  svg.addEventListener("pointermove", (event) => options.onPointer?.(normalizedPoint(event, svg)));
  svg.addEventListener("click", (event) => {
    if (event.target.closest("[data-zone]")) return;
    const point = normalizedPoint(event, svg);
    if (options.authoring) options.onAuthorPoint?.(point);
    else options.onPlace?.(point);
  });
  svg.addEventListener("dragover", (event) => event.preventDefault());
  svg.addEventListener("drop", (event) => { event.preventDefault(); options.onDropBoard?.(normalizedPoint(event, svg), event.dataTransfer?.getData("text/plain")); });
  return svg;
}

export function drawAuthoringPolygon(container, points) {
  const layer = container.querySelector("#authoring-layer"); if (!layer) return;
  layer.innerHTML = points.map((p) => `<circle cx="${p.x}" cy="${p.y}" r=".8" fill="#ee7b61"/>`).join("") + (points.length > 1 ? `<polyline points="${points.map((p) => `${p.x},${p.y}`).join(" ")}" fill="rgba(238,123,97,.14)" stroke="#ee7b61" stroke-width=".5"/>` : "");
}

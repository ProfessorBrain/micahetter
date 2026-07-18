export async function loadContent() {
  if (globalThis.__CRITICAL_STRUCTURES_CONTENT__) {
    return globalThis.__CRITICAL_STRUCTURES_CONTENT__;
  }
  const [structuresResponse, boardsResponse] = await Promise.all([fetch("/data/structures.json"), fetch("/data/boards.json")]);
  if (!structuresResponse.ok || !boardsResponse.ok) throw new Error("Anatomy content could not be loaded.");
  const [structureData, boardData] = await Promise.all([structuresResponse.json(), boardsResponse.json()]);
  return { structures: structureData.structures, contentMeta: structureData, boards: boardData.boards };
}

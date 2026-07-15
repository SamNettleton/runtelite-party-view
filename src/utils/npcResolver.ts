// NPC name resolver – mirrors the pattern used by itemResolver.ts.
// Data source: osrsbox-db npcs-summary.json
// Format:  { "<id>": { "id": number, "name": string }, ... }

const NPC_NAMES_URL =
  'https://raw.githubusercontent.com/osrsbox/osrsbox-db/master/docs/npcs-summary.json';

/** Flat id → name lookup built from the summary file. */
let npcDatabase: Record<string, string> = {};
let isLoaded = false;
let loadPromise: Promise<void> | null = null;

export const initNpcDatabase = (): Promise<void> => {
  if (isLoaded) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = fetch(NPC_NAMES_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch NPC names: ${res.status}`);
      return res.json();
    })
    .then((data: Record<string, { id: number; name: string }>) => {
      // Flatten { "42": { id: 42, name: "Zombie" } } → { "42": "Zombie" }
      for (const key of Object.keys(data)) {
        npcDatabase[key] = data[key].name;
      }
      isLoaded = true;
    })
    .catch((err) => {
      console.error('[npcResolver] Error loading NPC database:', err);
    });

  return loadPromise;
};

/**
 * Returns the NPC name for a given numeric ID.
 * Falls back to `"NPC #<id>"` if the database hasn't loaded yet or the ID is unknown.
 */
export const getNpcName = (id: number): string => {
  return npcDatabase[id.toString()] ?? `NPC #${id}`;
};

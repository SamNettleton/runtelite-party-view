let itemDatabase: Record<string, string> = {};
let isLoaded = false;

export const initItemDatabase = async () => {
  if (isLoaded) return;
  try {
    // Official RuneLite name cache
    const response = await fetch(
      'https://raw.githubusercontent.com/runelite/static.runelite.net/gh-pages/cache/item/names.json'
    );
    if (!response.ok) throw new Error('Failed to fetch item names');

    itemDatabase = await response.json();
    isLoaded = true;
  } catch (error) {
    console.error('Error loading item database:', error);
  }
};

export const getItemName = (id: number): string => {
  // RuneLite's names.json uses string keys for the IDs
  return itemDatabase[id.toString()] || `Item ${id}`;
};

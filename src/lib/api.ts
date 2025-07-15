async function fetchFox() {
  const res = await fetch("https://randomfox.ca/floof/");
  const data = await res.json();

  return data.image as string;
}

async function fetchCats() {
  const res = await fetch("https://api.thecatapi.com/v1/images/search?limit=8");
  const data = await res.json();

  // Despite using limit, the API seems to always return 10 for limit > 1
  return (data as { url: string }[]).map((d) => d.url).slice(0, 8);
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export async function loadImages() {
  const [fox, cats] = await Promise.all([fetchFox(), fetchCats()]);

  return shuffle([
    { url: fox, isFox: true },
    ...cats.map((url) => ({ url, isFox: false })),
  ]);
}

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

export interface Image {
  url: string;
  isFox: boolean;
}

async function loadImages(): Promise<Image[]> {
  const [fox, cats] = await Promise.all([fetchFox(), fetchCats()]);

  preloadImages([fox, ...cats]);

  return shuffle([
    { url: fox, isFox: true },
    ...cats.map((url) => ({ url, isFox: false })),
  ]);
}

function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    const img = new window.Image();
    img.src = url;
  });
}

export async function getImages() {
  // Start a background operation to load another image set into the cache
  loadImages().then((images) => imageCache.push(images));

  // Fallback incase we are burning through the cache before it is ready
  if (!imageCache.length) {
    return await loadImages();
  }

  // Pop the next set of images
  return imageCache.pop();
}

// Cache some image pages in advance
export async function populateImageCache(pageCount: number) {
  await Promise.all(
    Array(pageCount)
      .fill(null)
      .map(async () => {
        imageCache.push(await loadImages());
      })
  );
}

const imageCache: Image[][] = [];

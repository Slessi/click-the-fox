import { useEffect, useState } from "react";
import { loadImages } from "../lib/api";

interface GameProps {
  onTimerExpire(score: number): void;
}

export function Game({ onTimerExpire }: GameProps) {
  const [images, setImages] = useState<{ url: string; isFox: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  // TODO: Improve performance, preload API calls and images as needed, remove all loading states
  async function loadGridImages() {
    setLoading(true);

    try {
      const grid = await loadImages();
      setImages(grid);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGridImages();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimerExpire(score);
      return;
    }

    // TODO: Use react-timer ?
    // TODO: Use 'date' instead of -1? Also move timer down to minimise rerender cost?
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [score, timeLeft]);

  return (
    <>
      <div className="flex gap-8 mb-4">
        <div className="text-lg">
          Score: <span className="font-bold">{score}</span>
        </div>

        <div className="text-lg">
          Time left: <span className="font-bold">{timeLeft}</span>s
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            className="size-24 bg-gray-100 rounded overflow-hidden shadow hover:scale-125 transition"
            onClick={async () => {
              if (loading) return;

              setScore((s) => s + (img.isFox ? 1 : -1));

              await loadGridImages();
            }}
            disabled={loading}
          >
            <img
              src={img.url}
              alt="animal"
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </>
  );
}

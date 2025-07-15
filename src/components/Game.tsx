import { useEffect, useRef, useState } from "react";
import { getImages, type Image } from "../lib/api";

interface GameProps {
  onTimerExpire(score: number): void;
}

export function Game({ onTimerExpire }: GameProps) {
  const [images, setImages] = useState<Image[]>();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const clickThrottle = useRef(false);

  // Load first images
  useEffect(() => {
    (async function () {
      setImages(await getImages());
    })();
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

  async function onClickImg(img: Image) {
    // Throttled between pages
    if (clickThrottle.current) return;

    clickThrottle.current = true;
    setScore((s) => s + (img.isFox ? 1 : -1));
    setImages(await getImages());
    clickThrottle.current = false;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex text-center gap-8">
        <div className="text-lg">
          Score: <span className="font-bold">{score}</span>
        </div>

        <div className="text-lg">
          Time left: <span className="font-bold">{timeLeft}</span>s
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 px-4 sm:px-8">
        {images?.map((img) => (
          <button
            key={img.url}
            className="aspect-square max-w-48 bg-gray-100 rounded overflow-hidden shadow hover:scale-125 transition"
            onClick={() => onClickImg(img)}
          >
            <img
              src={img.url}
              alt="animal"
              className="object-cover size-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

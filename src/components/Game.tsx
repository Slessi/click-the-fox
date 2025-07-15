import { useEffect, useRef, useState } from "react";
import { getImages, type Image } from "../lib/api";
import { Timer } from "./Timer";

interface GameProps {
  onTimerExpire(score: number): void;
}

export function Game({ onTimerExpire }: GameProps) {
  const [images, setImages] = useState<Image[]>();
  const [score, setScore] = useState(0);
  const clickThrottle = useRef(false);

  // Load first images
  useEffect(() => {
    (async function () {
      setImages(await getImages());
    })();
  }, []);

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
          Time left:{" "}
          <span className="font-bold">
            <Timer onTimerExpire={() => onTimerExpire(score)}>
              {(timeLeft) => timeLeft}
            </Timer>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
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

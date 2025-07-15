import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Game } from "./components/Game";
import { Scoreboard } from "./components/Scoreboard";
import { WelcomeScreen } from "./components/WelcomeScreen";

// TODO: Better location for this?
export interface Score {
  name: string;
  date: Date;
  score: number;
}

function App() {
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    if (!gameOver) return;

    // TODO: Simplify local storage work
    const prev = JSON.parse(
      localStorage.getItem("fox-scores") || "[]"
    ) as (Omit<Score, "date"> & { date: string })[];

    const updated = [
      ...prev.map((s) => ({ ...s, date: parseISO(s.date) })),
      { name, date: new Date(), score },
    ];

    localStorage.setItem("fox-scores", JSON.stringify(updated));
    setScores(updated);
    setShowScoreboard(true);
  }, [gameOver]);

  useEffect(() => {
    if (showScoreboard) {
      const prev = JSON.parse(localStorage.getItem("fox-scores") || "[]");
      setScores(prev);
    }
  }, [showScoreboard]);

  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen bg-orange-50">
      <h1 className="text-4xl mb-6 font-bold text-orange-700">
        Click the Fox! Game
      </h1>

      {!gameStarted ? (
        <WelcomeScreen
          onClickPlay={(name: string) => {
            setName(name);
            setGameOver(false);
            setGameStarted(true);
          }}
        />
      ) : gameOver && showScoreboard ? (
        <Scoreboard
          name={name}
          score={score}
          scores={scores}
          onClickPlayAgain={() => {
            setShowScoreboard(false);
            setGameOver(false);
            setGameStarted(true);
          }}
          onClickBackToWelcome={() => {
            setShowScoreboard(false);
            setGameOver(false);
            setGameStarted(false);
          }}
        />
      ) : (
        <Game
          onTimerExpire={(score) => {
            setScore(score);
            setGameOver(true);
          }}
        />
      )}
    </main>
  );
}

export default App;

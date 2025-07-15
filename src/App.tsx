import { parseISO } from "date-fns";
import { useState } from "react";
import { Game } from "./components/Game";
import { Scoreboard } from "./components/Scoreboard";
import { WelcomeScreen } from "./components/WelcomeScreen";

// TODO: Better location for this?
export interface Score {
  name: string;
  date: Date;
  score: number;
}

type Page = "WELCOME" | "GAME" | "SCOREBOARD";

function App() {
  const [name, setName] = useState("");
  const [page, setPage] = useState<Page>("WELCOME");
  const [lastScore, setLastScore] = useState<Score>();
  const [allScores, setAllScores] = useState<Score[]>([]);

  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen bg-orange-50">
      <h1 className="text-4xl mb-6 font-bold text-orange-700">
        Click the Fox! Game
      </h1>

      {page === "WELCOME" ? (
        <WelcomeScreen
          onClickPlay={(name: string) => {
            setName(name);
            setPage("GAME");
          }}
        />
      ) : page === "SCOREBOARD" ? (
        <Scoreboard
          lastScore={lastScore!}
          allScores={allScores}
          onClickPlayAgain={() => {
            setLastScore(undefined);
            setPage("GAME");
          }}
          onClickBackToWelcome={() => {
            setName("");
            setLastScore(undefined);
            setPage("WELCOME");
          }}
        />
      ) : page === "GAME" ? (
        <Game
          onTimerExpire={(score) => {
            const newScore = { name, date: new Date(), score };

            // TODO: Simplify local storage work
            const oldScores = (
              JSON.parse(localStorage.getItem("fox-scores") || "[]") as (Omit<
                Score,
                "date"
              > & { date: string })[]
            ).map((s) => ({ ...s, date: parseISO(s.date) }));

            const updatedScores = [...oldScores, newScore];
            localStorage.setItem("fox-scores", JSON.stringify(updatedScores));

            setAllScores(updatedScores);
            setLastScore(newScore);
            setPage("SCOREBOARD");
          }}
        />
      ) : null}
    </main>
  );
}

export default App;

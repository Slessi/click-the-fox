import { useState } from "react";
import { Game } from "./components/Game";
import { Scoreboard } from "./components/Scoreboard";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { addScore } from "./lib/scores";

type Page = "WELCOME" | "GAME" | "SCOREBOARD";

function App() {
  const [name, setName] = useState("");
  const [page, setPage] = useState<Page>("WELCOME");

  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen bg-orange-50 py-2 px-4 sm:px-8">
      <h1 className="shrink-0 text-4xl text-center mb-6 font-bold text-orange-700">
        Click the Fox! Game
      </h1>

      <section>
        {page === "WELCOME" ? (
          <WelcomeScreen
            onClickPlay={(name: string) => {
              setName(name);
              setPage("GAME");
            }}
          />
        ) : page === "SCOREBOARD" ? (
          <Scoreboard
            onClickPlayAgain={() => {
              setPage("GAME");
            }}
            onClickBackToWelcome={() => {
              setName("");
              setPage("WELCOME");
            }}
          />
        ) : page === "GAME" ? (
          <Game
            onTimerExpire={(score) => {
              addScore({ name, date: new Date(), score });
              setPage("SCOREBOARD");
            }}
          />
        ) : null}
      </section>
    </main>
  );
}

export default App;

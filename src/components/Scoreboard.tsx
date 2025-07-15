import { compareAsc, format } from "date-fns";
import { getScores } from "../lib/scores";

interface ScoreboardProps {
  onClickPlayAgain(): void;
  onClickBackToWelcome(): void;
}

export function Scoreboard({
  onClickPlayAgain,
  onClickBackToWelcome,
}: ScoreboardProps) {
  const allScores = getScores();
  const lastScore = allScores.at(-1);

  return (
    <div className="flex flex-col justify-center items-center gap-4 h-full">
      <h2 className="text-2xl shrink-0 text-center font-semibold text-orange-700">
        SCOREBOARD
      </h2>

      <div className="grow max-h-64 overflow-auto">
        <table className="bg-white rounded shadow text-xs sm:text-base">
          <thead>
            <tr className="bg-orange-200">
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Score</th>
            </tr>
          </thead>

          <tbody className="overflow-auto">
            {[...allScores]
              // Sort by score then date
              .sort((a, b) =>
                b.score === a.score
                  ? compareAsc(a.date, b.date)
                  : b.score - a.score
              )
              .map((score, i) => (
                <tr
                  key={i}
                  className={
                    score.name === lastScore!.name &&
                    score.score === lastScore!.score &&
                    score.date === lastScore!.date
                      ? "bg-orange-100"
                      : ""
                  }
                >
                  <td className="bg-orange-200 px-4 py-2 text-center">
                    {i + 1}
                  </td>
                  <td className="px-4 py-2">{score.name}</td>
                  <td className="px-4 py-2 text-center">
                    {format(score.date, "yyyy, MMM d")}
                  </td>
                  <td className="px-4 py-2 text-end">{score.score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 shrink-0">
        <button
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded shadow hover:bg-gray-400 transition"
          onClick={onClickBackToWelcome}
        >
          To Welcome Screen
        </button>

        <button
          className="px-6 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition"
          onClick={onClickPlayAgain}
        >
          PLAY!
        </button>
      </div>
    </div>
  );
}

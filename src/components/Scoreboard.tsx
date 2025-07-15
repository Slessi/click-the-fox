import { compareAsc, format } from "date-fns";
import type { Score } from "../App";

interface ScoreboardProps {
  name: string;
  score: number;
  scores: Score[];
  onClickPlayAgain(): void;
  onClickBackToWelcome(): void;
}

export function Scoreboard({
  name,
  score,
  scores,
  onClickPlayAgain,
  onClickBackToWelcome,
}: ScoreboardProps) {
  return (
    <div className="px-2">
      <h2 className="text-2xl text-center font-semibold mb-4 text-orange-700">
        SCOREBOARD
      </h2>

      <table className="min-w-[320px] bg-white rounded shadow mb-6">
        <thead>
          <tr className="bg-orange-200">
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Score</th>
          </tr>
        </thead>

        <tbody>
          {[...scores]
            // Sort by score then date
            .sort((a, b) =>
              b.score === a.score
                ? compareAsc(a.date, b.date)
                : b.score - a.score
            )
            .map((row, i) => (
              <tr
                key={i}
                className={
                  // TODO: Better current score detection (id? apply to key also?)
                  row.name === name && row.score === score
                    ? "bg-orange-100"
                    : ""
                }
              >
                <td className="bg-orange-200 px-4 py-2 text-center">{i + 1}</td>
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2 text-center">
                  {format(row.date, "yyyy, MMM d")}
                </td>
                <td className="px-4 py-2 text-end">{row.score}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="flex gap-4">
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

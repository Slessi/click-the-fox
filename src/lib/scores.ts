import { parseISO } from "date-fns";

export interface Score {
  name: string;
  date: Date;
  score: number;
}

const LOCAL_STORAGE_SCORE_KEY = "fox-scores";

export function getScores() {
  const scoreStorageData =
    localStorage.getItem(LOCAL_STORAGE_SCORE_KEY) || "[]";

  // Date serialises to a string in storage
  const storeScores = JSON.parse(scoreStorageData) as (Omit<Score, "date"> & {
    date: string;
  })[];

  return storeScores.map<Score>((s) => ({ ...s, date: parseISO(s.date) }));
}

export function addScore(newScore: Score) {
  const oldScores = getScores();

  localStorage.setItem(
    LOCAL_STORAGE_SCORE_KEY,
    JSON.stringify([...oldScores, newScore])
  );
}

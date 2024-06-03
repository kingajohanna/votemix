import { GuessData } from "../components/OtherGuess";

export const calculatePercentagePoints = (
  guess: GuessData[],
  result: GuessData[]
) => {
  if (!guess || !result) {
    return 0;
  }

  // sort by name
  result.sort((a, b) => a.name.localeCompare(b.name));
  guess.sort((a, b) => a.name.localeCompare(b.name));

  // calculate percentage points
  let percentagePoint = 0;
  for (let i = 0; i < result.length; i++) {
    percentagePoint += Math.abs(result[i]?.percentage - guess[i]?.percentage);
  }

  return 100 - percentagePoint;
};

export const calculateParticipationPoints = (guess: number, result: number) => {
  if (!guess || !result) {
    return 0;
  }

  // calculate percentage points
  let percentagePoint = Math.abs(result - guess);

  if (percentagePoint === 0) {
    return 15;
  } else if (percentagePoint > 0 && percentagePoint <= 3) {
    return 10;
  } else if (percentagePoint > 3 && percentagePoint <= 5) {
    return 5;
  }
  return 0;
};

export const mandatesCalculatePoints = (
  guess: GuessData[],
  result: GuessData[]
) => {
  if (!guess || !result) {
    return -999999;
  }
  // sort by name
  result.sort((a, b) => a.name.localeCompare(b.name));
  guess.sort((a, b) => a.name.localeCompare(b.name));

  // calculate percentage points
  let percentagePoint = 0;
  for (let i = 0; i < result.length; i++) {
    percentagePoint += Math.abs(result[i]?.percentage - guess[i]?.percentage);
  }

  // calculate mandates points
  let mandatesPoint = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i].mandates === guess[i].mandates) {
      mandatesPoint += guess[i].mandates * 2;
    } else if (result[i].mandates > guess[i].mandates) {
      mandatesPoint += guess[i].mandates;
    } else {
      mandatesPoint += result[i].mandates!;
    }
  }

  return mandatesPoint - percentagePoint;
};

export const personalCalculatePoints = (
  guess: GuessData[],
  result: GuessData[]
) => {
  if (!guess || !result) {
    return -999999;
  }
  // sort by name
  result.sort((a, b) => a.name.localeCompare(b.name));
  guess.sort((a, b) => a.name.localeCompare(b.name));

  // calculate percentage points
  let percentagePoint = 0;
  for (let i = 0; i < result.length; i++) {
    percentagePoint += Math.abs(result[i]?.percentage - guess[i]?.percentage);
  }

  // calculate order points
  let point = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i].name === guess[i].name) {
      point += (i + 1) * 5;
    }
  }

  return point - percentagePoint;
};

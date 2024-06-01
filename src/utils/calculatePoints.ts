import { GuessData } from "../components/OtherGuess";

export const mandatesCalculatePoints = (
  guess: GuessData[],
  result: GuessData[]
) => {
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
    if (result[i].mandates >= guess[i].mandates) {
      mandatesPoint += guess[i].mandates;
    } else {
      mandatesPoint += result[i].mandates!;
    }
  }

  console.log("Percentage points: ", percentagePoint);
  console.log("Mandates points: ", mandatesPoint);
  console.log("sum", mandatesPoint - percentagePoint);
  return mandatesPoint - percentagePoint;
};

export const personalCalculatePoints = (
  guess: GuessData[],
  result: GuessData[]
) => {
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

  console.log("Points: ", percentagePoint);
  console.log("Order points: ", point);
  console.log("sum", point - percentagePoint);
  return point - percentagePoint;
};

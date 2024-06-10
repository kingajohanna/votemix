import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

export interface GuessData {
  name: string;
  percentage: number;
  color?: string;
  mandates: number;
}

export interface Guess {
  username: string;
  data: GuessData[];
  point?: number;
}
export interface GuessesProps {
  guesses: Guess[];
  final: Guess | undefined;
  getPoints: (guess: Guess) => number | undefined;
}

export const Guesses: React.FC<GuessesProps> = ({
  guesses,
  final,
  getPoints,
}) => {
  const [maxPoint, setMaxPoint] = React.useState(0);

  const getPointsForGuess = (guess: Guess) => {
    const points = getPoints(guess);
    if (points !== undefined && points > maxPoint) {
      setMaxPoint(points);
    }
    return points;
  };

  const sortedGuesses = guesses.map((guess) => ({
    ...guess,
    data: guess.data.sort((a, b) => a.name.localeCompare(b.name)),
    point: getPointsForGuess(guess),
  }));

  const orderedSortedGuesses = sortedGuesses.sort(
    (a, b) => (b.point || 0) - (a.point || 0)
  );

  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {sortedGuesses[0].data.map((row) => (
              <TableCell align="center" key={row.name}>
                {row.name}
              </TableCell>
            ))}
            <TableCell align="center">Pontszám</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {final?.data && (
            <TableRow>
              <TableCell align="center">
                <Typography>Eredmény</Typography>
              </TableCell>
              {final?.data.map((cell, index) => (
                <TableCell align="center" key={index}>
                  <Typography>{cell.percentage}</Typography>
                </TableCell>
              ))}
              <TableCell align="center">
                <Typography></Typography>
              </TableCell>
            </TableRow>
          )}
          {orderedSortedGuesses.map((row) => (
            <TableRow
              key={row.username}
              sx={{
                backgroundColor: row.point === maxPoint ? "#c3b7ec" : "",
              }}
            >
              <TableCell align="center">
                <Typography>{row.username}</Typography>
              </TableCell>
              {row.data.map((cell, index) => (
                <TableCell align="center" key={index}>
                  <Typography>{cell.percentage}</Typography>
                </TableCell>
              ))}
              <TableCell align="center">
                <Typography>{row.point?.toPrecision(2)}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

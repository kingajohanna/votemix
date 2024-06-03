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
  const sortedGuesses = guesses.map((guess) => ({
    ...guess,
    data: guess.data.sort((a, b) => a.name.localeCompare(b.name)),
  }));

  const getPointsForGuess = (guess: Guess) => {
    const points = getPoints(guess);
    if (points !== undefined && points > maxPoint) {
      setMaxPoint(points);
    }
    return points;
  };

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
          {sortedGuesses.map((row) => (
            <TableRow
              key={row.username}
              sx={{
                backgroundColor:
                  getPointsForGuess(row) === maxPoint ? "#c3b7ec" : "",
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
                <Typography>{getPointsForGuess(row)}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

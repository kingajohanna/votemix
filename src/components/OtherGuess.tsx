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
  getPoints: (guess: Guess) => number | undefined;
}

export const Guesses: React.FC<GuessesProps> = ({ guesses, getPoints }) => {
  const sortedGuesses = guesses.map((guess) => ({
    ...guess,
    data: guess.data.sort((a, b) => a.name.localeCompare(b.name)),
  }));
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
          {sortedGuesses.map((row) => (
            <TableRow key={row.username}>
              <TableCell align="center">
                <Typography>{row.username}</Typography>
              </TableCell>
              {row.data.map((cell, index) => (
                <TableCell align="center" key={index}>
                  <Typography>{cell.percentage}</Typography>
                </TableCell>
              ))}
              <TableCell align="center">
                <Typography>{getPoints(row)}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

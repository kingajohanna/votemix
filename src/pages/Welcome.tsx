import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Countdown from "../components/Countdown";
import { Menu } from "../components/Menu";
import { Participate } from "../components/Participate";
import { isVoteDisabled } from "../utils/disable";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../App";
import { useEffect, useState } from "react";

interface Points {
  username: string;
  ep: number;
  mayor: number;
  twelve: number;
  nine: number;
  budapestList: number;
  participation: number;
}

export const Welcome = () => {
  const [points, setPoints] = useState<Points[]>([]);
  const [max, setMax] = useState(0);

  useEffect(() => {
    getPoints();
  }, []);

  const getPoints = async () => {
    const querySnapshot = await getDocs(collection(db, "votemix"));
    let users: Points[] = [];
    let max = 0;
    querySnapshot.forEach((doc) => {
      if (doc.data().points) {
        const user = doc.data().points as Points;
        users.push(user);
        if (
          user.budapestList +
            user.ep +
            user.mayor +
            user.nine +
            user.twelve +
            user.participation >
          max
        ) {
          max =
            user.budapestList +
            user.ep +
            user.mayor +
            user.nine +
            user.twelve +
            user.participation;
        }
      }
    });
    setMax(max);
    setPoints(users);
  };

  return (
    <Menu title="Kezdőlap">
      <Box
        sx={{
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!isVoteDisabled() && <Countdown />}
        <Participate />
        {isVoteDisabled() && (
          <>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ marginTop: "16px" }}
            >
              Eredmények
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Felhasználónév</TableCell>
                    <TableCell align="center">Európai parlament</TableCell>
                    <TableCell align="center">Fővárosi közgyűlés</TableCell>
                    <TableCell align="center">Főpolgármester</TableCell>
                    <TableCell align="center">12. kerület</TableCell>
                    <TableCell align="center">9. kerület</TableCell>
                    <TableCell align="center">Részvétel</TableCell>
                    <TableCell align="center">Összesen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {points.map((user) => (
                    <TableRow
                      key={user.username}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        backgroundColor:
                          user.budapestList +
                            user.ep +
                            user.mayor +
                            user.twelve +
                            user.nine +
                            user.participation ===
                          max
                            ? "#c3b7ec"
                            : "white",
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {user.username}
                      </TableCell>
                      <TableCell align="center">{user.ep}</TableCell>
                      <TableCell align="center">{user.budapestList}</TableCell>
                      <TableCell align="center">{user.mayor}</TableCell>
                      <TableCell align="center">{user.twelve}</TableCell>
                      <TableCell align="center">{user.nine}</TableCell>
                      <TableCell align="center">{user.participation}</TableCell>
                      <TableCell align="center">
                        {user.ep +
                          user.budapestList +
                          user.mayor +
                          user.twelve +
                          user.nine +
                          user.participation}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Menu>
  );
};

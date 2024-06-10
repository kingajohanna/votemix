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
import "katex/dist/katex.min.css";

interface Points {
  username: string;
  ep: number;
  mayor: number;
  twelve: number;
  nine: number;
  budapestList: number;
  participation: number;
}

const games = [
  "Részvétel",
  "Európai Parlament",
  "Fővárosi közgyűlési lista",
  "Főpolgármester",
  "12. kerület",
  "9. kerület",
];

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
    const sorted = users.sort(
      (a, b) =>
        (b.budapestList +
        b.ep +
        b.mayor +
        b.nine +
        b.twelve +
        b.participation) -
        (a.budapestList +
        a.ep +
        a.mayor +
        a.nine +
        a.twelve +
        a.participation)
    );
    setMax(max);
    setPoints(sorted);
  };

  return (
    <Menu title="Kezdőlap">
      <Box
        sx={{
          paddingTop: "16px",
          paddingBottom: "16px",
          paddingLeft: { sm: "72px", xs: "16px" },
          paddingRight: { sm: "72px", xs: "16px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Üdvözöllek az oldalon!
        </Typography>
        <Typography variant="body1" gutterBottom textAlign="justify">
          Itt a 2024-es Európai Parlamenti és Önkormányzati választások
          eredményeire tudsz tippelni. A tippelés lezárultát a lenti
          visszaszámoló mutatja, eddig adhatod le tippedet a következő
          kategóriákban:
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "16px",
          }}
        >
          {games.map((item, index) => (
            <Box key={index} display="flex" alignItems="center">
              <Box
                width={8}
                height={8}
                borderRadius="50%"
                bgcolor="black"
                mr={1}
              />
              {item}
            </Box>
          ))}
        </Box>

        <Typography variant="body1" gutterBottom>
          A tippeket, a részvétel kivételével, amit ezen az oldalon, a hamburger
          menüből kiválasztva lehet leadni. Minden esetben <b>százalékokat</b>{" "}
          kell tippelni, azaz, hogy a részvételi, illetve a pártok vagy jelöltek
          támogatottságának aránya hogyan alakul.
        </Typography>
        <Typography variant="body1" gutterBottom textAlign="justify">
          <b>Pontszámítás:</b>
        </Typography>
        <Typography variant="body1" gutterBottom textAlign="justify">
          a részvételt kivéve, minden alversenyben a százalékos tévedést
          összegezzük és vonjuk le 100-ból. A részvételért csak bónusz pontokat
          lehet kapni: egészre kerekített pontos találat +15 pont, 3% tévedés
          +10 pont, 5% tévedés +5 pont. Így az alversenyeknek külön győztesei
          vannak, de a végső győztes az, akinek összetettben, azaz az összes
          alversenyben elért pontszámának összege a legmagasabb.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Mindez matematikailag:
        </Typography>

        <img
          src="/calc.png"
          alt="calc"
          style={{
            maxWidth: "470px",
            width: "100%",
            marginBottom: "16px",
          }}
        />

        {/*<Box sx={{}}>
          <InlineMath
            math={
              "\\forall Alverseny \\setminus \\{Részvétel\\}: Pont_i = 100 - \\sum_{j \\in Párt} |Eredmény_j - Tipp_j|"
            }
          />{" "}
          <BlockMath
            math={
              "RészvételBónusz = \\begin{cases}15 & \\text{ha } [Eredmény] = Tipp \\\\ 10 & \\text{ha } |[Eredmény] - Tipp| \\le 3 \\\\ 5 & \\text{ha } |[Eredmény] - Tipp| \\le 5 \\\\ 0 & \\text{különben} \\end{cases}"
            }
          />
          <InlineMath
            math={
              "ÖsszPont = RészvételBónusz + \\sum_{i \\in Alverseny \\setminus \\{Részvétel\\}}Pont_i"
            }
          />
          </Box>*/}
        {!isVoteDisabled() && (
          <>
            <Countdown />
            <Participate />
          </>
        )}
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
                      <TableCell align="center">{user.ep.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        {user.budapestList.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        {user.mayor.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        {user.twelve.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        {user.nine.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        {user.participation.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        {(
                          user.ep +
                          user.budapestList +
                          user.mayor +
                          user.twelve +
                          user.nine +
                          user.participation
                        ).toFixed(2)}
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

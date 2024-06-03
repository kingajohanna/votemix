import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../App";
import {
  Box,
  Button,
  InputAdornment,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { EditableTable, PartyData } from "../components/EditableTable";
import {
  initialBpList,
  initialEP,
  initialMayor,
  initialNine,
  initialTwelve,
} from "../utils/data";
import { calculateMandates } from "../utils/calculateMandates";
import {
  EditablePersonTable,
  PersonData,
} from "../components/EditablePersonTable";
import {
  calculateParticipationPoints,
  calculatePercentagePoints,
} from "../utils/calculatePoints";

interface User {
  username: string;
  ep: boolean;
  mayor: boolean;
  twelve: boolean;
  nine: boolean;
  budapestList: boolean;
  participation: boolean;
}

interface Points {
  username: string;
  ep: number;
  mayor: number;
  twelve: number;
  nine: number;
  budapestList: number;
  participation: number;
}

export const Admin = () => {
  const [username, _] = useLocalStorage("username");
  const [users, setUsers] = useState<User[]>([]);
  const [points, setPoints] = useState<Points[]>([]);
  const [ep, setEp] = useState(initialEP);
  const [mayor, setMayor] = useState(initialMayor);
  const [twelve, setTwelve] = useState(initialTwelve);
  const [nine, setNine] = useState(initialNine);
  const [bpList, setBpList] = useState(initialBpList);
  const [participation, setParticipation] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (username !== import.meta.env.VITE_ADMIN) {
      navigate("/welcome");
    }
    const fetchData = async () => {
      const users = await getUsers();
      setUsers(users);

      const points = await getPoints();
      setPoints(points);

      await getVoteData();
    };

    fetchData();
  }, []);

  const getVoteData = async () => {
    const docRef = doc(db, "votemix", "admin");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data().ep?.length > 0) setEp(docSnap.data().ep);
      if (docSnap.data().budapestlist?.length > 0)
        setBpList(docSnap.data().budapestlist);
      if (docSnap.data().mayor?.length > 0) setMayor(docSnap.data().mayor);
      if (docSnap.data().nine?.length > 0) setNine(docSnap.data().nine);
      if (docSnap.data().twelve?.length > 0) setTwelve(docSnap.data().twelve);
      if (docSnap.data().participation)
        setParticipation(docSnap.data().participation);
    }
  };

  const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "votemix"));
    let users: User[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id !== "admin")
        users.push({
          username: doc.id,
          ep: doc.data().ep?.length > 0,
          mayor: doc.data().mayor?.length > 0,
          twelve: doc.data().twelve?.length > 0,
          nine: doc.data().nine?.length > 0,
          budapestList: doc.data().budapestlist?.length > 0,
          participation: !!doc.data().participation,
        });
    });
    return users;
  };

  const getUserGuesses = async (username: string) => {
    const docRef = doc(db, "votemix", username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return {};
  };

  const getPoints = async () => {
    const querySnapshot = await getDocs(collection(db, "votemix"));
    let points: Points[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id !== "admin" && doc.data().points)
        points.push({
          username: doc.id,
          ep: doc.data().points.ep,
          mayor: doc.data().points.mayor,
          twelve: doc.data().points.twelve,
          nine: doc.data().points.nine,
          budapestList: doc.data().points.budapestList,
          participation: doc.data().participation,
        });
    });
    return points;
  };

  const personToGuessData = (person: PersonData[]) => {
    return person.map((p) => ({
      name: p.name,
      percentage: p.percentage,
      color: p.color,
      mandates: 0,
    }));
  };

  const calculatePoints = async () => {
    let newPoints: Points[] = [];
    await Promise.all(
      users.map(async (user) => {
        const userPoints: Points = {
          username: user.username,
          ep: 0,
          mayor: 0,
          twelve: 0,
          nine: 0,
          budapestList: 0,
          participation: 0,
        };
        const userGuesses = await getUserGuesses(user.username);
        userPoints.ep = calculatePercentagePoints(
          userGuesses.ep.slice(),
          ep.slice()
        );
        userPoints.mayor = calculatePercentagePoints(
          userGuesses.mayor,
          personToGuessData(mayor.slice())
        );
        userPoints.twelve = calculatePercentagePoints(
          userGuesses.twelve,
          personToGuessData(twelve.slice())
        );
        userPoints.nine = calculatePercentagePoints(
          userGuesses.nine,
          personToGuessData(nine.slice())
        );
        userPoints.budapestList = calculatePercentagePoints(
          userGuesses.budapestlist,
          bpList.slice()
        );

        userPoints.participation = calculateParticipationPoints(
          userGuesses.participation,
          participation
        );

        const userRef = doc(db, "votemix", user.username);
        setDoc(userRef, { points: userPoints }, { merge: true });

        newPoints.push(userPoints);
      })
    );
    setPoints(newPoints);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Játékosok
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
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.username}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell align="center">{user.ep ? "x" : ""}</TableCell>
                <TableCell align="center">
                  {user.budapestList ? "x" : ""}
                </TableCell>
                <TableCell align="center">{user.mayor ? "x" : ""}</TableCell>
                <TableCell align="center">{user.twelve ? "x" : ""}</TableCell>
                <TableCell align="center">{user.nine ? "x" : ""}</TableCell>
                <TableCell align="center">
                  {user.participation ? "x" : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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

      <Button
        onClick={async () => await calculatePoints()}
        variant="contained"
        sx={{ marginTop: "16px" }}
      >
        Pontok kiszámítása
      </Button>

      <Box
        sx={{
          marginTop: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Résztvételi arány
        </Typography>
        <OutlinedInput
          sx={{ width: "50%" }}
          value={participation}
          endAdornment={<InputAdornment position="end">%</InputAdornment>}
          onChange={(e) => {
            console.log(e.target.value);

            const newValue = parseInt(e.target.value);
            setParticipation(newValue);
            const userRef = doc(db, "votemix", "admin");
            setDoc(userRef, { participation: newValue }, { merge: true });
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        <Box sx={{ marginTop: "16px", marginRight: { sm: "16px", xs: 0 } }}>
          <Typography variant="h4" align="center" gutterBottom>
            EP eredmények
          </Typography>
          <EditableTable
            nonRestricted
            data={ep}
            setData={(value: PartyData[]) => {
              const newValue = calculateMandates(value, 21);
              setEp(newValue);
              const userRef = doc(db, "votemix", "admin");
              setDoc(userRef, { ep: newValue }, { merge: true });
            }}
            handleReset={() => {
              setEp(initialEP);
              const userRef = doc(db, "votemix", "admin");
              setDoc(userRef, { ep: [] }, { merge: true });
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ marginTop: "16px" }}
          >
            Fővárosi lista eredmények
          </Typography>
          <EditableTable
            nonRestricted
            data={bpList}
            setData={(value: PartyData[]) => {
              const newValue = calculateMandates(value, 32);
              setBpList(newValue);
              const userRef = doc(db, "votemix", "admin");
              setDoc(userRef, { budapestlist: newValue }, { merge: true });
            }}
            handleReset={() => {
              setBpList(initialBpList);
              const userRef = doc(db, "votemix", "admin");
              setDoc(userRef, { budapestlist: [] }, { merge: true });
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        <Box sx={{ marginTop: "16px", marginRight: { sm: "16px", xs: 0 } }}>
          <Typography variant="h4" align="center" sx={{ height: "84px" }}>
            Főpolgármester választás
          </Typography>
          <EditablePersonTable
            nonRestricted
            data={mayor}
            setData={(value: PersonData[]) => {
              setMayor(value);
              const userRef = doc(db, "votemix", "admin");
              setDoc(userRef, { mayor: value }, { merge: true });
            }}
            handleReset={() => {
              setMayor(initialMayor);
              const userRef = doc(db, "votemix", "admin");
              setDoc(userRef, { mayor: [] }, { merge: true });
            }}
          />
        </Box>

        <Box sx={{ marginTop: "16px", marginRight: { sm: "16px", xs: 0 } }}>
          <Typography variant="h4" align="center" sx={{ height: "84px" }}>
            12. kerület
          </Typography>
          <EditablePersonTable
            nonRestricted
            data={twelve}
            setData={(value: PersonData[]) => {
              setTwelve(value);
              const userRef = doc(db, "votemix", "admin");
              setDoc(userRef, { twelve: value }, { merge: true });
            }}
            handleReset={() => {
              setTwelve(initialTwelve);
              const userRef = doc(db, "votemix", "admin");
              setDoc(userRef, { twelve: [] }, { merge: true });
            }}
          />
        </Box>

        <Box sx={{ marginTop: "16px" }}>
          <Typography variant="h4" align="center" sx={{ height: "84px" }}>
            9. kerület
          </Typography>
          <EditablePersonTable
            nonRestricted
            data={nine}
            setData={(value: PersonData[]) => {
              setNine(value);
              const userRef = doc(db, "votemix", "admin");
              setDoc(userRef, { nine: value }, { merge: true });
            }}
            handleReset={() => {
              setNine(initialNine);
              const userRef = doc(db, "votemix", "admin");
              setDoc(userRef, { nine: [] }, { merge: true });
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

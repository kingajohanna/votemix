import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../App";
import {
  Box,
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
  initialTwelve,
} from "../utils/data";
import { calculateMandates } from "../utils/calculateMandates";
import {
  EditablePersonTable,
  PersonData,
} from "../components/EditablePersonTable";

interface User {
  username: string;
  ep: boolean;
  mayor: boolean;
  twelve: boolean;
  nine: boolean;
  budapestList: boolean;
}

export const Admin = () => {
  const [username, _] = useLocalStorage("username");
  const [users, setUsers] = useState<User[]>([]);
  const [ep, setEp] = useState(initialEP);
  const [mayor, setMayor] = useState(initialMayor);
  const [twelve, setTwelve] = useState(initialTwelve);
  // const [nine, setNine] = useState(initialNine);
  const [bpList, setBpList] = useState(initialBpList);
  const [participation, setParticipation] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (username !== "kingajohanna") {
      navigate("/welcome");
    }
    const fetchData = async () => {
      const users = await getUsers();
      setUsers(users);
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
      // if (docSnap.data().nine?.length > 0) setNine(docSnap.data().nine);
      if (docSnap.data().twelve?.length > 0) setTwelve(docSnap.data().twelve);
      if (docSnap.data().participation?.length > 0)
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
        });
    });
    return users;
  };

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
        Játékosok
      </Typography>
      <TableContainer component={Paper}>
        <Table style={{ tableLayout: "fixed" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Név</TableCell>
              <TableCell align="center">EP</TableCell>
              <TableCell align="center">Budapest List</TableCell>
              <TableCell align="center">Mayor</TableCell>
              <TableCell align="center">Twelve</TableCell>
              <TableCell align="center">Nine</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
            const newValue = parseFloat(e.target.value);
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
        <Box sx={{ marginTop: "16px", marginRight: "16px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            EP eredmények
          </Typography>
          <EditableTable
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
        <Box sx={{ marginTop: "16px", marginRight: "16px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Főpolgármester választás
          </Typography>
          <EditablePersonTable
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

        <Box sx={{ marginTop: "16px", marginRight: "16px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            12. kerület
          </Typography>
          <EditablePersonTable
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

        {/*<Box>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ marginTop: "16px" }}
          >
            9. kerület
          </Typography>
          <EditablePersonTable
            data={nine}
            setData={(value: PersonData[]) => {
              setNine(value);
              const userRef = doc(db, "votemix", "admin");
              setDoc(userRef, { nine: value }, { merge: true });
            }}
            handleReset={() => setNine(initialNine)}
          />
          </Box>*/}
      </Box>
    </Box>
  );
};

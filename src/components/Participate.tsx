import { InputAdornment, OutlinedInput, Typography } from "@mui/material";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../App";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const Participate = () => {
  const [username, _] = useLocalStorage("username");
  const [value, setValue] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "votemix", username);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.data().participation) {
          setValue(docSnap.data().participation);
        } else {
          setValue(0);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Részvételi arány
      </Typography>
      <OutlinedInput
        type="number"
        placeholder={value.toString()}
        endAdornment={<InputAdornment position="end">%</InputAdornment>}
        error={error}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (value < 0 || value > 100) setError(true);
          else {
            setError(false);
            setValue(value);
            const userRef = doc(db, "votemix", username);
            setDoc(userRef, { participation: value }, { merge: true });
          }
        }}
      />
    </>
  );
};

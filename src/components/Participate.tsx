import { InputAdornment, OutlinedInput, Typography } from "@mui/material";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../App";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Map } from "./Map";
import { isVoteDisabled } from "../utils/disable";
import { Buttons } from "./Buttons";
import { useNavigate } from "react-router-dom";

export const Participate = () => {
  const [username, _] = useLocalStorage("username");
  const [value, setValue] = useState(0);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (isVoteDisabled()) {
        const docRef = doc(db, "votemix", "admin");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          if (docSnap.data().participation) {
            setValue(docSnap.data().participation);
          }
        }
      }
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
      <Map percentage={value} />
      <OutlinedInput
        type="number"
        sx={{
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              display: "none",
            },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        }}
        disabled={isVoteDisabled()}
        value={value}
        endAdornment={<InputAdornment position="end">%</InputAdornment>}
        error={error}
        onKeyDown={(e) => {
          if (
            !/^[0-9]+$/.test(e.key) &&
            e.key !== "Backspace" &&
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight"
          ) {
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (value < 0 || value > 100) setError(true);
          else {
            setSaved(false);
            setError(false);
            setValue(value);
            const userRef = doc(db, "votemix", username);
            setDoc(userRef, { participation: value }, { merge: true });
          }
        }}
      />
      <Buttons
        next={() => navigate("/european-parliament")}
        saved={saved}
        onsave={() => setSaved(true)}
      />
    </>
  );
};

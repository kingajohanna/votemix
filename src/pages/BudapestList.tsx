import HighchartsReact from "highcharts-react-official";
import { Menu } from "../components/Menu";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { EditableTable, PartyData } from "../components/EditableTable";
import { calculateMandates } from "../utils/calculateMandates";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../App";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { initialBpList } from "../utils/data";
import { mandatesCalculatePoints } from "../utils/calculatePoints";
import { Guess, Guesses } from "../components/OtherGuess";
import { isVoteDisabled } from "../utils/disable";

export const BudapestList = () => {
  const [username, _] = useLocalStorage("username");
  const [data, setData] = useState(initialBpList);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [final, setFinal] = useState<Guess>();

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "votemix", username);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.data().budapestlist?.length > 0) {
          setData(docSnap.data().budapestlist);
        } else {
          setData(initialBpList);
        }
      }

      const querySnapshot = await getDocs(collection(db, "votemix"));

      let guesses: Guess[] = [];

      querySnapshot.forEach((doc) => {
        if (doc.id !== "admin" && doc.data().budapestlist?.length > 0)
          guesses.push({
            username: doc.id,
            data: doc.data().budapestlist.map((row: PartyData) => ({
              name: row.name,
              percentage: row.percentage,
              mandates: row.mandates,
            })),
          });
        else if (doc.id === "admin" && doc.data().budapestlist?.length > 0)
          setFinal({
            username: doc.id,
            data: doc.data().budapestlist.map((row: PartyData) => ({
              name: row.name,
              color: row.color,
              percentage: row.percentage,
              mandates: row.mandates,
            })),
          });
      });
      setGuesses(guesses);
    };

    fetchData();
  }, []);

  const getData = () => {
    let sum = 0;
    data.map((row) => (sum += row.mandates));

    if (32 - sum > 0) {
      return [
        ...data.map((row) => [row.name, row.mandates, row.color, row.name]),
        ["no party", 32 - sum, "#a6a4a4", "no party"],
      ];
    }
    return data.map((row) => [row.name, row.mandates, row.color, row.name]);
  };

  const [options, setOptions] = useState({
    chart: {
      type: "item",
    },

    title: {
      text: "",
    },

    legend: {
      labelFormat: '{name} <span style="opacity: 0.4">{y}</span>',
      maxHeight: 140,
    },

    series: [
      {
        name: "Number of seats",
        keys: ["name", "y", "color", "label"],
        data: getData(),
        dataLabels: {
          enabled: false,
          format: "{point.label}",
        },
        center: ["50%", "88%"],
        size: "170%",
        startAngle: -100,
        endAngle: 100,
      },
    ],
  });

  useEffect(() => {
    if (isVoteDisabled() && final?.data && final.data.length > 0) {
      setOptions({
        ...options,
        series: [
          {
            ...options.series[0],
            size: "100%",
            data: final.data.map((row) => [
              row.name,
              row.mandates,
              row.color || "#a6a4a4",
              row.name,
            ]),
          },
        ],
      });
    } else if (isVoteDisabled()) {
      setOptions({
        ...options,
        series: [
          {
            ...options.series[0],
            size: "100%",
            data: [["no party", 32, "#a6a4a4", "no party"]],
          },
        ],
      });
    } else
      setOptions({
        ...options,
        series: [
          {
            ...options.series[0],
            size: "170%",
            data: getData(),
          },
        ],
      });
  }, [data, final]);

  return (
    <Menu title="Fővárosi közgyűlési lista">
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { width: "100%" } }}
          updateArgs={[true, true, true]}
        />
        {!isVoteDisabled() && data && (
          <EditableTable
            data={data}
            setData={(value: PartyData[]) => {
              const newValue = calculateMandates(value, 32);
              setData(newValue);
              const userRef = doc(db, "votemix", username);
              setDoc(userRef, { budapestlist: newValue }, { merge: true });
            }}
            handleReset={() => {
              setData(initialBpList);
              const userRef = doc(db, "votemix", username);
              setDoc(userRef, { budapestlist: [] }, { merge: true });
            }}
          />
        )}
        {isVoteDisabled() && guesses.length > 0 && (
          <Guesses
            guesses={guesses}
            getPoints={(guess) => {
              if (final?.data && final.data.length > 0)
                return mandatesCalculatePoints(
                  guess.data.slice(),
                  final.data.slice()
                );
            }}
          />
        )}
      </Box>
    </Menu>
  );
};

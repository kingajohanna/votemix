import HighchartsReact from "highcharts-react-official";
import { Menu } from "../components/Menu";
import itemSeries from "highcharts/modules/item-series";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import { EditableTable, PartyData } from "../components/EditableTable";
import { Box } from "@mui/material";
import { db } from "../App";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { calculateMandates } from "../utils/calculateMandates";
import { initialEP } from "../utils/data";
import { Guess, Guesses } from "../components/OtherGuess";
import { isVoteDisabled } from "../utils/disable";
import { mandatesCalculatePoints } from "../utils/calculatePoints";

itemSeries(Highcharts);

export const EuropeanParliament = () => {
  const [username, _] = useLocalStorage("username");
  const [data, setData] = useState(initialEP);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [final, setFinal] = useState<Guess>();

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "votemix", username);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.data().ep?.length > 0) {
          setData(docSnap.data().ep);
        } else {
          setData(initialEP);
        }
      }

      const querySnapshot = await getDocs(collection(db, "votemix"));

      let guesses: Guess[] = [];

      querySnapshot.forEach((doc) => {
        if (doc.id !== "admin" && doc.data().ep?.length > 0)
          guesses.push({
            username: doc.id,
            data: doc.data().ep.map((row: PartyData) => ({
              name: row.name,
              percentage: row.percentage,
              mandates: row.mandates,
            })),
          });
        else if (doc.id === "admin" && doc.data().ep?.length > 0)
          setFinal({
            username: doc.id,
            data: doc.data().ep.map((row: PartyData) => ({
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

    if (21 - sum > 0) {
      return [
        ...data.map((row) => [row.name, row.mandates, row.color, row.name]),
        ["no party", 21 - sum, "#a6a4a4", "no party"],
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
            data: [["no party", 21, "#a6a4a4", "no party"]],
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
    <Menu title="Európai Parlament">
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
              const newValue = calculateMandates(value, 21);
              setData(newValue);
              const userRef = doc(db, "votemix", username);
              setDoc(userRef, { ep: newValue }, { merge: true });
            }}
            handleReset={() => {
              setData(initialEP);
              const userRef = doc(db, "votemix", username);
              setDoc(userRef, { ep: [] }, { merge: true });
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

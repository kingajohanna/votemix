import { Box } from "@mui/material";
import { Menu } from "../components/Menu";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../App";
import {
  EditablePersonTable,
  PersonData,
} from "../components/EditablePersonTable";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { initialNine } from "../utils/data";
import { Guess, Guesses } from "../components/OtherGuess";
import { calculatePercentagePoints } from "../utils/calculatePoints";
import { isVoteDisabled } from "../utils/disable";

export const Nine = () => {
  const [username, _] = useLocalStorage("username");
  const [data, setData] = useState(initialNine);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [final, setFinal] = useState<Guess>();

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "votemix", username);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.data().nine?.length > 0) {
          setData(docSnap.data().nine);
        } else {
          setData(initialNine);
        }
      }

      const querySnapshot = await getDocs(collection(db, "votemix"));

      let guesses: Guess[] = [];

      querySnapshot.forEach((doc) => {
        if (doc.id !== "admin" && doc.data().nine?.length > 0)
          guesses.push({
            username: doc.id,
            data: doc.data().nine.map((row: PersonData) => ({
              name: row.name,
              percentage: row.percentage,
            })),
          });
        else if (doc.id === "admin" && doc.data().nine?.length > 0)
          setFinal({
            username: doc.id,
            data: doc.data().nine.map((row: PersonData) => ({
              name: row.name,
              color: row.color,
              percentage: row.percentage,
            })),
          });
      });

      setGuesses(guesses);
    };

    fetchData();
  }, []);

  const getData = () => {
    return [
      ...data.map((row) => [row.name, row.percentage, row.color, row.name]),
    ];
  };

  const [options, setOptions] = useState({
    chart: {
      type: "column",
    },

    title: {
      text: "",
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Százalék",
      },
      max: 100,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.y:.1f}%",
        },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: ' +
        "<b>{point.y:.2f}%</b> of total<br/>",
    },

    series: [
      {
        name: "Browsers",
        keys: ["name", "y", "color", "label"],
        colorByPoint: true,
        data: getData(),
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
            data: final.data.map((row) => [
              row.name,
              row.percentage,
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
            data: [],
          },
        ],
      });
    } else
      setOptions({
        ...options,
        series: [
          {
            ...options.series[0],
            data: getData(),
          },
        ],
      });
  }, [data, final]);

  return (
    <Menu title="9. kerület">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "16px",
        }}
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { width: "100%" } }}
          updateArgs={[true, true, true]}
        />
        {!isVoteDisabled() && data && (
          <EditablePersonTable
            data={data}
            setData={(value: PersonData[]) => {
              setData(value);
              const userRef = doc(db, "votemix", username);
              setDoc(userRef, { nine: value }, { merge: true });
            }}
            handleReset={() => {
              setData(initialNine);
              const userRef = doc(db, "votemix", username);
              setDoc(userRef, { nine: [] }, { merge: true });
            }}
          />
        )}
        {isVoteDisabled() && guesses.length > 0 && (
          <Guesses
            guesses={guesses}
            final={final}
            getPoints={(guess: Guess) => {
              if (final?.data && final.data.length > 0)
                return calculatePercentagePoints(
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

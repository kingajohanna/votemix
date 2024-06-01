import HighchartsReact from "highcharts-react-official";
import { Menu } from "../components/Menu";
import itemSeries from "highcharts/modules/item-series";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import { EditableTable, PartyData } from "../components/EditableTable";
import { Box } from "@mui/material";
import { db } from "../App";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { calculateMandates } from "../utils/ep";
import { initialEP } from "../utils/data";

itemSeries(Highcharts);

export const EuropeanParliament = () => {
  const [username, _] = useLocalStorage("username");
  const [data, setData] = useState(initialEP);
  //const [guesses, setGuesses] = useState<Guess[]>([]);

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

      /* const querySnapshot = await getDocs(collection(db, "votemix"));
      let guesses: Guess[] = [];
      querySnapshot.forEach((doc) =>
        guesses.push({
          username: doc.id,
          data: doc.data().ep.map((row: PartyData) => ({
            name: row.name,
            percentage: row.percentage,
          })),
        })
      );
      setGuesses(guesses); */
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
    setOptions({
      ...options,
      series: [
        {
          ...options.series[0],
          data: getData(),
        },
      ],
    });
  }, [data]);

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
        {data && (
          <EditableTable
            data={data}
            setData={(value: PartyData[]) => {
              const newValue = calculateMandates(value, 21);
              setData(newValue);
              const userRef = doc(db, "votemix", username);
              setDoc(userRef, { ep: newValue }, { merge: true });
            }}
          />
        )}
        {/*guesses.length > 0 && <Guesses guesses={guesses} />*/}
      </Box>
    </Menu>
  );
};

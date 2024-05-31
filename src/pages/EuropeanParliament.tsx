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

itemSeries(Highcharts);

const initalData: PartyData[] = [
  { id: 1, name: "Fidesz", percentage: 0, mandates: 0, color: "#F58D42" },
  {
    id: 2,
    name: "Tisza Párt",
    percentage: 0,
    mandates: 0,
    color: "#E56750",
  },
  {
    id: 3,
    name: "DK–MSZP–Párbeszéd",
    percentage: 0,
    mandates: 0,
    color: "#1063a9",
  },
  {
    id: 4,
    name: "Mi Hazánk",
    percentage: 0,
    mandates: 0,
    color: "#6a8c1c",
  },
  { id: 5, name: "Momentum", percentage: 0, mandates: 0, color: "#9069d4" },
  { id: 6, name: "MKKP", percentage: 0, mandates: 0, color: "#da0000" },
  {
    id: 9,
    name: "Mindenki Magyarországa Néppárt",
    percentage: 0,
    mandates: 0,
    color: "#011166",
  },
  { id: 7, name: "Jobbik", percentage: 0, mandates: 0, color: "#111" },
  {
    id: 8,
    name: "Második Reformkor",
    percentage: 0,
    mandates: 0,
    color: "#f2db7d",
  },

  { id: 10, name: "LMP", percentage: 0, mandates: 0, color: "#7dc340" },
  { id: 11, name: "MEMO", percentage: 0, mandates: 0, color: "#e51e25" },
];

export const EuropeanParliament = () => {
  const [username, _] = useLocalStorage("username");
  const [data, setData] = useState(initalData);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "votemix", username);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.data().ep.length === 0) {
          setData(initalData);
        }
        setData(docSnap.data().ep);
      }
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
      </Box>
    </Menu>
  );
};

import HighchartsReact from "highcharts-react-official";
import { Menu } from "../components/Menu";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { EditableTable, PartyData } from "../components/EditableTable";
import { calculateMandates } from "../utils/ep";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../App";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { initialBpList } from "../utils/data";

export const BudapestList = () => {
  const [username, _] = useLocalStorage("username");
  const [data, setData] = useState(initialBpList);

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
    };

    fetchData();
  }, []);

  const getData = () => {
    let sum = 0;
    data.map((row) => (sum += row.mandates));

    if (21 - sum > 0) {
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
        {data && (
          <EditableTable
            data={data}
            setData={(value: PartyData[]) => {
              const newValue = calculateMandates(value, 32);
              setData(newValue);
              const userRef = doc(db, "votemix", username);
              setDoc(userRef, { budapestlist: newValue }, { merge: true });
            }}
          />
        )}
      </Box>
    </Menu>
  );
};

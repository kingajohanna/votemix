import { Box } from "@mui/material";
import { Menu } from "../components/Menu";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../App";
import {
  EditablePersonTable,
  PersonData,
} from "../components/EditablePersonTable";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { initialNine } from "../utils/data";

export const Nine = () => {
  const [username, _] = useLocalStorage("username");
  const [data, setData] = useState(initialNine);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "votemix", username.toLowerCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.data().nine?.length > 0) {
          setData(docSnap.data().nine);
        } else {
          setData(initialNine);
        }
      }
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
        <EditablePersonTable
          data={data}
          setData={(value: PersonData[]) => {
            setData(value);
            const userRef = doc(db, "votemix", username);
            setDoc(userRef, { nine: value }, { merge: true });
          }}
        />
      </Box>
    </Menu>
  );
};

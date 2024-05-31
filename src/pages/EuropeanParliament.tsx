import HighchartsReact from "highcharts-react-official";
import { Menu } from "../components/Menu";
import itemSeries from "highcharts/modules/item-series";
import Highcharts from "highcharts";
import { useState } from "react";
import { EditableTable, PartyData } from "../components/EditableTable";
import { Box } from "@mui/material";

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
  const [data, setData] = useState(initalData);

  const getData = () => {
    return [
      ...data.map((row) => [row.name, row.mandates, row.color, row.name]),
      ["no party", 21, "#a6a4a4", "no party"],
    ];
  };

  const [options, _] = useState({
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

  return (
    <Menu title="Európai Parlament">
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { width: "100%" } }}
        />
        {data && <EditableTable data={data} setData={setData} />}
      </Box>
    </Menu>
  );
};

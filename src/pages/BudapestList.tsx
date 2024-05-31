import HighchartsReact from "highcharts-react-official";
import { Menu } from "../components/Menu";
import Highcharts from "highcharts";
import { useState } from "react";

export const BudapestList = () => {
  const [options, setOptions] = useState({
    chart: {
      type: "item",
    },

    title: {
      text: "",
    },

    legend: {
      labelFormat: '{name} <span style="opacity: 0.4">{y}</span>',
    },

    series: [
      {
        name: "Number of seats",
        keys: ["name", "y", "color", "label"],
        data: [
          ["Sinn Féin", 7, "#326760", "Sinn Féin"],
          ["Green Party", 1, "#6AB023", "Green Party"],
          ["Plaid Cymru", 4, "#008142", "Plaid Cymru"],
          ["Liberal Democrat", 11, "#FAA61A", "Liberal Democrat"],
        ],
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
    <Menu title="Fővárosi közgyűlési lista">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Menu>
  );
};

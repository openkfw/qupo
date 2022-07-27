import Box from "@mui/material/Box";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Portfolio composition",
    },
  },
};

// sample processed data
const data1 = {
  labels: [],
  datasets: [
    {
      label: "Dataset 1",
      data: [],
      borderColor: "#000",
      backgroundColor: "#fff",
    },
    {
      label: "Dataset 2",
      data: [],
      borderColor: "#000",
      backgroundColor: "#fff",
    },
  ],
};

const QuantumDashboard = ({ data }) => {
  const processedData = data1;

  const processData = () => {
    const datasets = [
      {
        label: "Classical solver - OSQP",
        data: [],
      },
    ];
    const labels = [];
    for (const [key, value] of Object.entries(data.RateOfReturn)) {
      labels.push(key);
      datasets[0].data.push(value);
    }

    return { labels, datasets };
  };

  console.log(data);
  return <Box>{data && <Bar options={options} data={processData()} />}</Box>;
};

export default QuantumDashboard;

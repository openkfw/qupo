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
const data = {
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

const QuantumDashboard = () => {
  const processedData = data;
  return (
    <Box>
      <Bar options={options} data={processedData} />
    </Box>
  );
};

export default QuantumDashboard;

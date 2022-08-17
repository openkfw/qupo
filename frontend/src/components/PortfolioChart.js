import { useRef } from "react";
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
      borderWidth: 1,
    },
  },
  scaleShowValues: true,
  scales: {
    y: {
      ticks: {
        autoSkip: false,
      },
    },
    x: {
      min: 0,
      max: 1,
      stepSize: 0.1,
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

const PortfolioChart = ({ data }) => {
  const chartRef = useRef();

  const processData = (dataToProcess) => {
    const datasets = [];
    const labels = new Set([]);
    const colors = ["#c6e6f5", "#87bbd0", "#417670", "#336a7e", "#002d3c"];

    Object.keys(dataToProcess).forEach((model, index) => {
      const dataset = {
        label: `${model}`,
        data: [],
        backgroundColor: colors[index],
      };

      for (const [key, value] of Object.entries(
        dataToProcess[model].RateOfReturn
      )) {
        labels.add(key);
        dataset.data.push(value);
      }

      datasets.push(dataset);
    });

    return { labels: [...labels], datasets };
  };

  return (
    <Bar
      height="200vh"
      ref={chartRef}
      options={options}
      data={processData(data)}
    />
  );
};

export default PortfolioChart;

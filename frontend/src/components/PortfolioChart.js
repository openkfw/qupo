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
      max: 100,
      stepSize: 10,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Portfolio composition",
    },
    tooltip: {
      callbacks: {
        title: function (context) {
          const symbols = context[0]?.dataset.symbols;
          const symbol = symbols[context[0]?.dataIndex] || "";

          return `${context[0]?.label} ${symbol ? `: ${symbol}` : ""}`;
        },
      },
    },
  },
};

const shortenString = (word, length) => {
  return word.length > length ? `${word.slice(0, length)}...` : word;
};

const processData = (dataToProcess) => {
  const datasets = [];
  const symbolNames = dataToProcess[0]?.Calculation?.symbol_names;
  const labels = symbolNames.map((name) => shortenString(name, 16));
  const colors = ["#c6e6f5", "#87bbd0", "#417670", "#336a7e", "#002d3c"];

  dataToProcess.forEach(({ Calculation, Result }, index) => {
    const dataset = {
      label: `${Calculation.model}`,
      data: [],
      symbols: Calculation.symbols,
      backgroundColor: colors[index],
    };

    // used iteration over list of symbols to have a predefined order
    Calculation.symbols.forEach((symbol) => {
      dataset.data.push(Result.rate_of_return[symbol]);
    });

    datasets.push(dataset);
  });

  return { labels: labels, datasets };
};

const PortfolioChart = ({ data }) => {
  return <Bar height="200vh" options={options} data={processData(data)} />;
};

export default PortfolioChart;

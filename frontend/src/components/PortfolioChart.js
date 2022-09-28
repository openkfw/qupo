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
      // the legend is kept on the bottom to keep space for graphs
      position: "bottom",
    },
    title: {
      display: true,
      text: "Portfolio composition",
    },
    // This makes the tooltip to display company name, in case the label is the stocker symbol
    tooltip: {
      callbacks: {
        title: function (context) {
          const symbolNames = context[0]?.dataset.symbol_names;
          const symbolName = symbolNames[context[0]?.dataIndex] || "";

          return `${context[0]?.label} ${symbolName ? `: ${symbolName}` : ""}`;
        },
      },
    },
  },
};

const processData = (dataToProcess) => {
  const datasets = [];
  // expectation is that symbols and symbol names should be the same in all calculations, so we take the first one
  const symbols = dataToProcess[0]?.Calculation?.symbols;
  // const symbol_labels = dataToProcess[0]?.Calculation?.symbol_names;

  // if we want to show just symbols, we just pass them as labels
  const labels = symbols;
  // or this way we show the ticker symbol + name, which might be too long for the label though
  // If this is enabled, please disable the tooltip custom function in the chart options above
  // const labels = symbols.map(
  //   (symbol, index) => `${symbol}: ${symbol_labels[index]}`
  // );
  const colors = ["#c6e6f5", "#87bbd0", "#417670", "#336a7e", "#002d3c"];

  dataToProcess.forEach(({ Calculation, Result }, index) => {
    const dataset = {
      label: `${Calculation.model}`,
      data: [],
      symbol_names: Calculation.symbol_names,
      backgroundColor: colors[index],
    };

    // used iteration over list of symbols to have a predefined order
    Calculation.symbols.forEach((symbol) => {
      dataset.data.push(Result.rate_of_return[symbol]);
    });

    datasets.push(dataset);
  });

  return { labels: [...labels], datasets };
};

const PortfolioChart = ({ data }) => {
  return <Bar height="200vh" options={options} data={processData(data)} />;
};

export default PortfolioChart;

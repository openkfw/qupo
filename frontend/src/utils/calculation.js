import dayjs from "dayjs";
import store from "store-js";

import { getModelCalculations } from "../api";

export const constructCalculation = (data) => {
  return {
    timestamp: dayjs(),
    models: data.map((model) => model.Calculation.model),
    companies: data[0].Calculation.symbol_names,
    symbols: data[0].Calculation.symbols,
    risk_weight: data[0].Calculation.risk_weight,
    esg_weight: data[0].Calculation.esg_weight,
    start: data[0].Calculation.start,
    end: data[0].Calculation.end,
    portfolio: data,
  };
};

export const combineCalculations = (
  classicalCalculation,
  quantumCalculation
) => {
  const combinedModels = [
    ...classicalCalculation.models,
    ...quantumCalculation.models,
  ];

  return {
    ...classicalCalculation,
    models: combinedModels,
    portfolio: [
      ...classicalCalculation.portfolio,
      ...quantumCalculation.portfolio,
    ],
  };
};

export const calculateModels = async (
  addNotification,
  weights,
  timeframe,
  models
) => {
  const symbols = store.get("selected_symbols");
  const firstTenSymbols = symbols.slice(0, 10).map((symbol) => symbol.symbol);

  const data = await getModelCalculations(
    models,
    firstTenSymbols,
    weights,
    timeframe
  );

  const rates = data[0]?.Result?.rate_of_return;

  if (rates) {
    const notReturnedSymbols = firstTenSymbols.filter(
      (symbol) => rates[symbol] === undefined
    );

    if (notReturnedSymbols.length) {
      data[0].Calculation.symbols = data[0].Calculation.symbols.filter(
        (symbol) => !notReturnedSymbols.includes(symbol)
      );
      addNotification({
        severity: "warning",
        message: `Symbols not available: ${notReturnedSymbols.join(", ")}`,
      });
    }
  }

  return constructCalculation(data);
};

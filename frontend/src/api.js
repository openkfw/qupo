import axios from "axios";

export const getSymbols = async (symbolsOnly = false) => {
  const response = await axios.get(
    `/api/tickers/symbols?symbols_only=${symbolsOnly}`
  );
  return response.data;
};

export const getIndices = async (index = "") => {
  const route = index ? `/${index}?symbols_only=False` : "";
  const response = await axios.get(`/api/tickers/indices${route}`);
  return response.data;
};

export const getCountries = async (country = "") => {
  const route = country ? `/${country}?symbols_only=False` : "";
  const response = await axios.get(`/api/tickers/countries${route}`);
  return response.data;
};

export const getIndustries = async (industry = "") => {
  const route = industry ? `/${industry}?symbols_only=False` : "";
  const response = await axios.get(`/api/tickers/industries${route}`);
  return response.data;
};

export const getModelCalculations = async (
  models,
  symbols,
  weights,
  timeframe
) => {
  const response = await axios.post("/api/models", {
    models: models,
    symbols: symbols,
    risk_weight: weights.risk_weight.value,
    esg_weight: weights.esg_weight.value,
    start: timeframe.start,
    end: timeframe.end,
  });
  return await response.data;
};

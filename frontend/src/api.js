export const getSymbols = async (symbolsOnly = false) => {
  const response = await fetch(
    `/api/tickers/symbols?symbols_only=${symbolsOnly}`
  );
  return await response.json();
};

export const getIndices = async (index = "") => {
  const route = index ? `/${index}?symbols_only=False` : "";
  const response = await fetch(`/api/tickers/indices${route}`);
  return await response.json();
};

export const getCountries = async (country = "") => {
  const route = country ? `/${country}?symbols_only=False` : "";
  const response = await fetch(`/api/tickers/countries${route}`);
  return await response.json();
};

export const getIndustries = async (industry = "") => {
  const route = industry ? `/${industry}?symbols_only=False` : "";
  const response = await fetch(`/api/tickers/industries${route}`);
  return await response.json();
};

export const getModelCalculations = async (
  models,
  symbols,
  weights,
  timeframe
) => {
  const response = await fetch("/api/models", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      models: models,
      symbols: symbols,
      risk_weight: weights.risk_weight.value,
      esg_weight: weights.esg_weight.value,
      start: timeframe.start,
      end: timeframe.end,
    }),
  });
  return await response.json();
};

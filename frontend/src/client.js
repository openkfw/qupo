import axios from "axios";
import config from "./utils/config";

class ApiClient {
  constructor() {
    this.config = { ...config };
    this.apiClient = this.getApiClient(this.config);
  }

  getApiClient(config) {
    return axios.create({
      baseURL: `${config.apiBaseUrl}`,
      headers: { "Content-Type": "application/json" },
    });
  }

  getSymbols(symbolsOnly = false) {
    return this.apiClient
      .get(`/tickers/symbols?symbols_only=${symbolsOnly}`)
      .then(({ data }) => {
        return data;
      })
      .catch((error) => console.error(error));
  }

  getIndices(index = "") {
    const route = index ? `/${index}?symbols_only=False` : "";
    return this.apiClient
      .get(`/tickers/indices${route}`)
      .then(({ data }) => {
        return data;
      })
      .catch((error) => console.error(error));
  }

  getCountries(country = "") {
    const route = country ? `/${country}?symbols_only=False` : "";
    return this.apiClient
      .get(`/tickers/countries${route}`)
      .then(({ data }) => {
        return data;
      })
      .catch((error) => console.error(error));
  }

  getIndustries(industry = "") {
    const route = industry ? `/${industry}?symbols_only=False` : "";
    return this.apiClient
      .get(`/tickers/industries${route}`)
      .then(({ data }) => {
        return data;
      })
      .catch((error) => console.error(error));
  }

  getModelCalculations(models, symbols, riskWeight, esgWeight) {
    return this.apiClient
      .post("/models", {
        models: models,
        symbols: symbols,
        risk_weight: riskWeight,
        esg_weight: esgWeight,
      })
      .then(({ data }) => {
        return data ? data : [];
      })
      .catch((error) => console.error(error));
  }
}

export default ApiClient;

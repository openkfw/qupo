import axios from "axios";
import config from "./config";

class ApiClient {
  constructor() {
    this.config = { ...config };
    this.apiClient = this.getApiClient(this.config);
  }

  getApiClient(config) {
    return axios.create({
      baseURL: `${config.apiBaseUrl}/api`,
      headers: { "Content-Type": "application/json" },
    });
  }

  getSymbols(symbolsOnly = true) {
    return this.apiClient
      .get(`/tickers/symbols?symbols_only=${symbolsOnly}`)
      .then(({ data }) => {
        return data;
      });
  }
}

export default ApiClient;

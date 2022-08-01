import axios from "axios";
import config from "./utils/config";

const SYMBOLS = [
  "LIN.DE",
  "SAP.DE",
  "SIE.DE",
  "VOW3.DE",
  "ALV.DE",
  "AIR.DE",
  "MRK.DE",
  "DTE.DE",
  "DPW.DE",
  "BMW.DE",
  "BAS.DE",
  "IFX.DE",
  "BAYN.DE",
  "ADS.DE",
  "MUV2.DE",
  "VNA.DE",
  "HEN3.DE",
  "EOAN.DE",
  "DB1.DE",
  "PAH3.DE",
  "DBK.DE",
  "RWE.DE",
  "BEI.DE",
  "DHER.DE",
  "FRE.DE",
  "CON.DE",
  "ZAL.DE",
  "FME.DE",
  "SY1.DE",
  "PUM.DE",
  "HEI.DE",
  "BNR.DE",
  "1COV.DE",
  "MTX.DE",
  "HFG.DE",
  "QIA.DE",
];

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

  getSymbols(symbolsOnly = true) {
    return this.apiClient
      .get(`/tickers/symbols?symbols_only=${symbolsOnly}`)
      .then(({ data }) => {
        return data;
      })
      .catch((error) => console.error(error));
  }

  getIndices(index = "") {
    const route = index ? `/${index}?symbols_only=True` : "";
    return this.apiClient
      .get(`/tickers/indices${route}`)
      .then(({ data }) => {
        return data;
      })
      .catch((error) => console.error(error));
  }

  getCountries(country = "") {
    const route = country ? `/${country}?symbols_only=True` : "";
    return this.apiClient
      .get(`/tickers/countries${route}`)
      .then(({ data }) => {
        return data;
      })
      .catch((error) => console.error(error));
  }

  getIndustries(industry = "") {
    const route = industry ? `/${industry}?symbols_only=True` : "";
    return this.apiClient
      .get(`/tickers/industries${route}`)
      .then(({ data }) => {
        return data;
      })
      .catch((error) => console.error(error));
  }

  getModelCalculations(
    models = ["osqp", "pypo", "qio"],
    symbols = ["ACCT"],
    riskWeight = 0.001,
    esgWeight = 0.001
  ) {
    return this.apiClient
      .post("/models", {
        models: models,
        symbols: SYMBOLS,
        risk_weight: riskWeight,
        esg_weight: esgWeight,
      })
      .then(({ data }) => {
        return data;
      })
      .catch((error) => console.error(error));
  }
}

export default ApiClient;

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { getCountries, getIndices, getIndustries, getSymbols } from "./api";

import "./App.css";
import Process from "./pages//Process/Process";
import Portfolio from "./pages/Portfolio";
import Stocks from "./pages/Stocks";

import dayjs from "dayjs";
import store from "store-js";
import eventsPlugin from "store-js/plugins/events";
import Notifications from "./components/Notifications";

store.addPlugin(eventsPlugin);

const initialTimeframe = {
  start: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
  end: dayjs().format("YYYY-MM-DD"),
  format: "YYYY-MM-DD",
  isValid: true,
};

const initialWeights = {
  risk_weight: { label: "Risk Weight", value: 50 },
  esg_weight: { label: "ESG Weight", value: 40 },
  setValues: (prevState, key, value) => ({
    ...prevState,
    [key]: { ...prevState[key], value: parseInt(value) },
  }),
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [timeframe, setTimeframe] = useState(initialTimeframe);
  const [weights, setWeights] = useState(initialWeights);

  const resetProcess = () => {
    setData(undefined);
    setTimeframe(initialTimeframe);
    setWeights(initialWeights);
  };

  useEffect(() => {
    store.set("loading", false);

    const fetchIndices = async () => {
      const indices = await getIndices();
      store.set("indices", indices);
      indices.map(async (index) => {
        const symbolsOfIndex = await getIndices(index);
        store.set(index, symbolsOfIndex);
      });
    };

    const fetchCountries = async () => {
      const countries = await getCountries();
      store.set("countries", countries);
      countries.map(async (country) => {
        const symbolsOfCountry = await getCountries(country);
        store.set(country, symbolsOfCountry);
      });
    };

    const fetchIndustries = async () => {
      const industries = await getIndustries();
      store.set("industries", industries);
      industries.map(async (industry) => {
        const symbolsOfIndustry = await getIndustries(industry);
        store.set(industry, symbolsOfIndustry);
      });
    };

    const fetchSymbols = async () => {
      const symbols = await getSymbols();
      store.set("symbols", symbols);
    };

    if (!store.get("industries")) {
      setLoading(true);
      fetchIndices();
      fetchCountries();
      fetchSymbols();
      fetchIndustries().then(() => setLoading(false));
    }
  }, []);

  return (
    <Grid sx={{ pb: 5, bgcolor: "grey.light" }}>
      <Grid sx={{ bgcolor: "primary.dark", height: "25vh", width: "100vW" }} />
      <Container
        maxWidth="md"
        sx={{
          marginTop: "-15vh",
          backgroundColor: "common.white",
          color: "grey.dark",
          boxShadow: "1px 1px 9px #607d8b",
          paddingBottom: 3,
          borderRadius: "2px",
        }}
      >
        <Box sx={{ textAlign: "center", p: "50px" }}>
          <Typography variant="h3">Portfolio Management</Typography>
        </Box>
        {!loading ? (
          <Routes>
            <Route path="/" element={<Stocks />} />
            <Route
              path="/process"
              element={
                <Process
                  setData={setData}
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                  weights={weights}
                  setWeights={setWeights}
                />
              }
            />
            <Route
              path="/portfolio"
              element={
                <Portfolio
                  data={data}
                  setData={setData}
                  timeframe={timeframe}
                  weights={weights}
                  setWeights={setWeights}
                  resetProcess={resetProcess}
                />
              }
            />
          </Routes>
        ) : (
          <Grid container justifyContent="center" sx={{ py: 10 }}>
            <CircularProgress size="7rem" />
          </Grid>
        )}
      </Container>
      <Notifications />
    </Grid>
  );
}

export default AppWrapper;

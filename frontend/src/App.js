import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getIndices, getCountries, getIndustries } from "./api";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import "./App.css";
import Process from "./pages//Process/Process";
import Portfolio from "./pages/Portfolio";
import Stocks from "./pages/Stocks";

import dayjs from "dayjs";
import store from "store-js";
import eventsPlugin from "store-js/plugins/events";
store.addPlugin(eventsPlugin);

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.grey.light,
    paddingBottom: theme.spacing(5),
  },
  heading: {
    textAlign: "center",
    padding: "50px",
  },
  banner: {
    backgroundColor: theme.palette.primary.dark,
    height: "25vh",
    width: "100vw",
  },
  container: {
    marginTop: "-15vh",
    backgroundColor: theme.palette.common.white,
    color: theme.palette.grey.dark,
    boxShadow: "1px 1px 9px #607d8b",
    paddingBottom: theme.spacing(3),
    borderRadius: "2px",
  },
}));

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

function App() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState({
    start: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD"),
    format: "YYYY-MM-DD",
    isValid: true,
  });
  const [weights, setWeights] = useState({
    risk_weight: { label: "Risk Weight", value: 50 },
    esg_weight: { label: "ESG Weight", value: 40 },
    setValues: (prevState, key, value) => ({
      ...prevState,
      [key]: { ...prevState[key], value: parseInt(value) },
    }),
  });

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

    if (!store.get("industries")) {
      setLoading(true);
      fetchIndices();
      fetchCountries();
      fetchIndustries().then(() => setLoading(false));
    }
  }, []);

  return (
    <Grid className={classes.background}>
      <Grid className={classes.banner} />
      <Container maxWidth="md" className={classes.container}>
        <Box className={classes.heading}>
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
    </Grid>
  );
}

export default AppWrapper;

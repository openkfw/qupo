import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import "./App.css";
import ApiClient from "./client";
import Process from "./pages//Process/Process";
import Portfolio from "./pages/Portfolio";
import Stocks from "./pages/Stocks";

import store from "store-js";
import eventsPlugin from "store-js/plugins/events";
store.addPlugin(eventsPlugin);

const client = new ApiClient();

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
  const [data, setData] = useState(null);
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
      setLoading(true);
      const indices = await client.getIndices();
      store.set("indices", indices);
      indices.map(async (index) => {
        const symbolsOfIndex = await client.getIndices(index);
        store.set(index, symbolsOfIndex);
      });
    };

    const fetchCountries = async () => {
      const countries = await client.getCountries();
      store.set("countries", countries);
      countries.map(async (country) => {
        const symbolsOfCountry = await client.getCountries(country);
        store.set(country, symbolsOfCountry);
      });
    };

    const fetchIndustries = async () => {
      const industries = await client.getIndustries();
      store.set("industries", industries);
      industries.map(async (industry) => {
        const symbolsOfIndustry = await client.getIndustries(industry);
        store.set(industry, symbolsOfIndustry);
      });
      setLoading(false);
    };

    if (!store.get("industries")) {
      fetchIndices();
      fetchCountries();
      fetchIndustries();
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
                  client={client}
                  setData={setData}
                  weights={weights}
                  setWeights={setWeights}
                />
              }
            />
            <Route
              path="/portfolio"
              element={
                <Portfolio
                  client={client}
                  data={data}
                  setData={setData}
                  weights={weights}
                  setWeights={setWeights}
                />
              }
            />
          </Routes>
        ) : (
          <CircularProgress />
        )}
      </Container>
    </Grid>
  );
}

export default AppWrapper;

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import "./App.css";
import ApiClient from "./client";
import Portfolio from "./pages/Portfolio";
import Process from "./pages/Process";
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
    paddingBottom: theme.spacing(1),
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
  const [data, setData] = useState(null);
  const [weights, setWeights] = useState({
    risk_weight: { label: "Risk Weight", value: 50 },
    esg_weight: { label: "ESG Weight", value: 50 },
    setValues: (prevState, key, value) => ({
      ...prevState,
      [key]: { ...prevState[key], value: parseInt(value) },
    }),
  });

  useEffect(() => {
    const fetchIndices = async () => {
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
        <Box sx={{ textAlign: "center", padding: "50px" }}>
          <Typography variant="h3">Portfolio Management</Typography>
        </Box>
        <Routes>
          <Route path="/" element={<Stocks />} />
          <Route
            path="/process"
            element={
              <Process
                client={client}
                data={data}
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
      </Container>
    </Grid>
  );
}

export default AppWrapper;

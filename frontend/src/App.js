import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import "./App.css";
import ApiClient from "./client";
import ProcessFlow from "./pages/ProcessFlow";
import QuantumDashboard from "./pages/QuantumDashboard";
import Stocks from "./pages/Stocks";

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
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [weights, setWeights] = useState({
    risk_weight: 50,
    esg_weight: 50,
  });

  return (
    <Grid className={classes.background}>
      <Grid className={classes.banner} />
      <Container maxWidth="md" className={classes.container}>
        <Box sx={{ textAlign: "center", padding: "5vh" }}>
          <Typography variant="h3">Portfolio Management</Typography>
        </Box>
        <Routes>
          <Route
            path="/"
            element={
              <Stocks client={client} setSelectedSymbols={setSelectedSymbols} />
            }
          />
          <Route
            path="/process"
            element={
              <ProcessFlow
                client={client}
                weights={weights}
                setWeights={setWeights}
                selectedSymbols={selectedSymbols}
                setSelectedSymbols={setSelectedSymbols}
              />
            }
          />
          <Route path="/chart" element={<QuantumDashboard />} />
        </Routes>
      </Container>
    </Grid>
  );
}

export default AppWrapper;

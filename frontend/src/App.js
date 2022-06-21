import { useState } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import "./App.css";
import ApiClient from "./client";
import Controllers from "./components/Controllers";
import CustomList from "./components/CustomList";
import QuantumDashboard from "./components/QuantumDashboard";

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

function App() {
  const classes = useStyles();
  const [view, setView] = useState("index");

  return (
    <Grid className={classes.background}>
      <Grid className={classes.banner} />
      <Container maxWidth="md" className={classes.container}>
        <Box sx={{ textAlign: "center", padding: "5vh" }}>
          <Typography variant="h3">Portfolio Management</Typography>
        </Box>
        <Controllers view={view} setView={setView} />
        <CustomList view={view} client={client} setView={setView} />
        {view === "chart" && (
          <div hidden={!(view === "chart")}>
            <QuantumDashboard />
          </div>
        )}
      </Container>
    </Grid>
  );
}

export default App;

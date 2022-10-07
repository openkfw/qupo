import { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BarChartIcon from "@mui/icons-material/BarChart";

import PortfolioCalculationsList from "../components/Portfolio/PortfolioCalculationsList";
import PortfolioController from "../components/Portfolio/PortfolioController";
import PortfolioResult from "../components/Portfolio/PortfolioResult";
import RestartButton from "../components/RestartButton";

import store from "store-js";

const Portfolio = ({
  data,
  setData,
  timeframe,
  weights,
  setWeights,
  resetProcess,
}) => {
  const [loading, setLoading] = useState(store.get("loading"));

  useEffect(() => {
    store.watch("loading", () => setLoading(store.get("loading")));
  });

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={1}
    >
      <Grid container sx={{ mt: -5 }}>
        <RestartButton resetProcess={resetProcess} />
      </Grid>
      <PortfolioController
        setData={setData}
        timeframe={timeframe}
        weights={weights}
        setWeights={setWeights}
      />
      <Grid item xs={9}>
        {loading && !data.length && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ pt: "40%" }}
          >
            <CircularProgress size="7rem" />
          </Grid>
        )}
        {data.length ? (
          <PortfolioResult data={data} timeframe={timeframe} />
        ) : null}
        {!loading && !data.length && (
          <Stack alignItems="center">
            <BarChartIcon sx={{ fontSize: 300, color: "whitesmoke" }} />
            <Typography sx={{ color: "#42424238", fontSize: 30 }}>
              No data
            </Typography>
            <Typography sx={{ color: "#42424238", fontSize: 14, pb: 8 }}>
              Go to the panel and press calculate to see some results.
            </Typography>
          </Stack>
        )}
      </Grid>
      {store.get("calculations") && (
        <PortfolioCalculationsList
          calculations={store.get("calculations")}
          setData={setData}
        />
      )}
    </Grid>
  );
};

export default Portfolio;

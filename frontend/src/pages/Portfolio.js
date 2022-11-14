import { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BarChartIcon from "@mui/icons-material/BarChart";
import ErrorIcon from "@mui/icons-material/Error";

import PortfolioActions from "../components/Portfolio/PortfolioActions";
import PortfolioCalculationsList from "../components/Portfolio/PortfolioCalculationsList";
import PortfolioController from "../components/Portfolio/PortfolioController";
import PortfolioResult from "../components/Portfolio/PortfolioResult";

import { useShowNotifications } from "../contexts/NotificationContext";

import store from "store-js";

const Portfolio = ({
  data,
  setData,
  timeframe,
  setTimeframe,
  weights,
  setWeights,
  resetProcess,
}) => {
  const calculations = store.get("calculations");
  const { notifications } = useShowNotifications();
  const [loading, setLoading] = useState(store.get("loading"));
  const [showErrorHelp, setShowErrorHelp] = useState(false);

  useEffect(() => {
    const isError = notifications?.some(
      (notification) =>
        notification.message === "Could not calculate portfolio."
    );
    if (isError) setShowErrorHelp(true);
  }, [notifications]);

  useEffect(() => {
    store.watch("loading", () => setLoading(store.get("loading")));
  });

  const updateChart = (calculation) => {
    setTimeframe({
      ...timeframe,
      start: calculation.start,
      end: calculation.end,
    });
    setData(calculation);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={1}
    >
      <PortfolioActions resetProcess={resetProcess} />
      <PortfolioController
        setData={setData}
        timeframe={timeframe}
        weights={weights}
        setWeights={setWeights}
      />
      <Grid item xs={9}>
        {loading && !data && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ pt: "40%" }}
          >
            <CircularProgress size="7rem" />
          </Grid>
        )}
        {data ? <PortfolioResult data={data} timeframe={timeframe} /> : null}
        {!loading && !data && (
          <Stack alignItems="center">
            <BarChartIcon sx={{ fontSize: 300, color: "whitesmoke" }} />
            <Typography sx={{ color: "#42424238", fontSize: 30 }}>
              No data
            </Typography>
            <Typography sx={{ color: "#42424238", fontSize: 14, pb: 5 }}>
              Go to the panel and press calculate to see some results.
            </Typography>
            {showErrorHelp ? (
              <Stack direction="row">
                <ErrorIcon color="error" />
                <Typography
                  sx={{ color: "grey.main", fontSize: 14, pt: 0.3, pl: 0.5 }}
                >
                  Go back and vary the <b>time period</b>. Or try choosing
                  different <b>symbols</b>.
                </Typography>
              </Stack>
            ) : null}
          </Stack>
        )}
      </Grid>
      {calculations && (
        <PortfolioCalculationsList
          key={calculations.length}
          calculations={calculations}
          data={data}
          updateChart={updateChart}
        />
      )}
    </Grid>
  );
};

export default Portfolio;

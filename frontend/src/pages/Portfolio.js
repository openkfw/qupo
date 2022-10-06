import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BarChartIcon from "@mui/icons-material/BarChart";

import PortfolioController from "../components/PortfolioController";
import PortfolioChart from "../components/PortfolioChart";
import Performance from "../components/Performance";
import RestartButton from "../components/RestartButton";

import store from "store-js";
import dayjs from "dayjs";

const Portfolio = ({
  data,
  setData,
  timeframe,
  weights,
  setWeights,
  resetProcess,
}) => {
  const [loading, setLoading] = useState(store.get("loading"));
  const dateFormat = "DD MMM YYYY";

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
          <Card variant="outlined">
            <Grid sx={{ p: 2 }} container justifyContent="flex-end">
              <Typography
                variant="caption"
                sx={{
                  color: (theme) => `${theme.palette.grey.main}`,
                }}
              >
                {dayjs(timeframe.start, timeframe.format).format(dateFormat)} to{" "}
                {dayjs(timeframe.end, timeframe.format).format(dateFormat)}
              </Typography>
            </Grid>
            <Grid sx={{ px: 1, pb: 1.3 }}>
              <PortfolioChart data={data} />
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                backgroundColor: (theme) => `${theme.palette.grey.light}`,
                padding: `1 0`,
                marginTop: 0.9,
              }}
            >
              {data.map(({ Calculation, Result }) => (
                <Performance
                  key={Calculation.model}
                  model={Result}
                  modelName={Calculation.model}
                />
              ))}
            </Box>
          </Card>
        ) : null}
        {!loading && !data.length && (
          <Stack alignItems="center">
            <BarChartIcon sx={{ fontSize: 300, color: "whitesmoke" }} />
            <Typography sx={{ color: "#42424238", fontSize: 30 }}>
              No data selected
            </Typography>
            <Typography sx={{ color: "#42424238", fontSize: 14, pb: 8 }}>
              Go to the panel and press calculate to see some results.
            </Typography>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
};

export default Portfolio;

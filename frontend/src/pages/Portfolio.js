import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import BarChartIcon from "@mui/icons-material/BarChart";

import PortfolioController from "../components/PortfolioController";
import PortfolioChart from "../components/PortfolioChart";
import Performance from "../components/Performance";

import store from "store-js";

const useStyles = makeStyles((theme) => ({
  box: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    backgroundColor: theme.palette.grey.light,
    padding: `${theme.spacing(1)} 0`,
    marginTop: theme.spacing(2),
  },
}));

const Portfolio = ({ data, setData, weights, setWeights }) => {
  const classes = useStyles();
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
      <PortfolioController
        setData={setData}
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
            <Grid sx={{ p: 1 }}>
              <PortfolioChart data={data} />
            </Grid>
            <Box className={classes.box}>
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

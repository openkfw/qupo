import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import SelectModels from "../../components/SelectModels";
import StocksCollection from "../../components/StocksCollection";
import SelectTimeframe from "../../components/SelectTimeframe";
import WeightSlider from "../../components/WeightSlider";

const ProcessOverview = ({ timeframe, setTimeframe, weights, setWeights }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        sx={{
          padding: "1 0",
        }}
      >
        Selected Symbols:
      </Typography>
      <StocksCollection />
      <Typography
        variant="h5"
        sx={{
          padding: "1 0",
        }}
      >
        Answers:
      </Typography>
      <Typography sx={{ pb: 2 }}>
        Based on your answers in step 2, the following weights were set:
      </Typography>
      <Grid sx={{ p: 2 }}>
        <WeightSlider
          keyWeight="risk_weight"
          weights={weights}
          setWeights={setWeights}
        />
        <WeightSlider
          keyWeight="esg_weight"
          weights={weights}
          setWeights={setWeights}
        />
      </Grid>
      <Typography
        variant="h5"
        sx={{
          padding: "1 0",
        }}
      >
        Models:
      </Typography>
      <SelectModels defaultModels={["osqp", "qio"]} />
      <Grid sx={{ pt: 2 }}>
        <Typography
          variant="h5"
          sx={{
            padding: "1 0",
          }}
        >
          Time Period:
        </Typography>
        <Typography>
          Select the timeframe in which the stock prices should be taken in
          consideration:
        </Typography>
        <SelectTimeframe timeframe={timeframe} setTimeframe={setTimeframe} />
      </Grid>
    </Box>
  );
};

export default ProcessOverview;

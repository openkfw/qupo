import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import ModelsSelection from "../../components/ModelsSelection";
import StocksSelection from "../../components/Stocks/StocksSelection";
import TimeframeSelection from "../../components/TimeframeSelection";
import WeightSlider from "../../components/WeightSlider";

const ProcessOverview = ({ timeframe, setTimeframe, weights, setWeights }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ pb: 1 }}>
        Selected Symbols:
      </Typography>
      <StocksSelection />
      <Typography variant="h5" sx={{ py: 1 }}>
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
      <Typography variant="h5" sx={{ py: "1" }}>
        Models:
      </Typography>
      <ModelsSelection defaultModels={["osqp", "qio"]} />
      <Grid sx={{ pt: 2 }}>
        <Typography variant="h5" sx={{ py: "1" }}>
          Time Period:
        </Typography>
        <Typography>
          Select the timeframe in which the stock prices should be taken in
          consideration:
        </Typography>
        <TimeframeSelection timeframe={timeframe} setTimeframe={setTimeframe} />
      </Grid>
    </Box>
  );
};

export default ProcessOverview;

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import store from "store-js";

import CalculateButton from "../CalculateButton";
import SelectModels from "../SelectModels";
import StocksCollection from "../StocksCollection";
import WeightSlider from "../WeightSlider";

const PortfolioController = ({ setData, timeframe, weights, setWeights }) => {
  return (
    <Grid item xs={3}>
      <Card variant="outlined" sx={{ p: 2, mb: 1 }}>
        <Grid sx={{ pr: 1 }}>
          <WeightSlider
            keyWeight="risk_weight"
            weights={weights}
            setWeights={setWeights}
            size="small"
          />
          <WeightSlider
            keyWeight="esg_weight"
            weights={weights}
            setWeights={setWeights}
            size="small"
          />
        </Grid>
        <StocksCollection size="small" />
        <SelectModels defaultModels={store.get("selected_models")} />
      </Card>
      <CalculateButton
        timeframe={timeframe}
        weights={weights}
        setData={setData}
      />
    </Grid>
  );
};

export default PortfolioController;
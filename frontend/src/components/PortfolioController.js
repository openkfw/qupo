import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import CalculateButton from "./CalculateButton";
import StocksCollection from "./StocksCollection";
import WeightSlider from "./WeightSlider";

const PortfolioController = ({
  client,
  data,
  setData,
  weights,
  setWeights,
}) => {
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
        <StocksCollection client={client} />
      </Card>
      <CalculateButton
        client={client}
        weights={weights}
        data={data}
        setData={setData}
      />
    </Grid>
  );
};

export default PortfolioController;

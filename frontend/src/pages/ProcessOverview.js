import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import StocksCollection from "../components/StocksCollection";
import WeightSlider from "../components/WeightSlider";

const useStyles = makeStyles((theme) => ({
  heading: {
    padding: `${theme.spacing(1)} 0`,
  },
}));

const ProcessOverview = ({ client, weights, setWeights }) => {
  const classes = useStyles();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" className={classes.heading}>
        Selected Symbols:
      </Typography>
      <StocksCollection client={client} />
      <Typography variant="h5" className={classes.heading}>
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
    </Box>
  );
};

export default ProcessOverview;

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import StocksCollection from "./StocksCollection";
import WeightSlider from "./WeightSlider";

const useStyles = makeStyles((theme) => ({
  heading: {
    padding: `${theme.spacing(1)} 0`,
  },
}));

const ProcessOverview = ({ client, weights, setWeights }) => {
  const classes = useStyles();
  const labels = ["Risk Weight", "ESG Weight"];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" className={classes.heading}>
        Selected Symbols:
      </Typography>
      <StocksCollection client={client} />
      <Typography variant="h5" className={classes.heading}>
        Answers:
      </Typography>
      <Typography>
        Based on your answers in step 2, the following weights were set:
      </Typography>
      {Object.keys(weights).map((key, index) => (
        <Grid key={key}>
          <Typography>{labels[index]}:</Typography>
          <WeightSlider
            weight={weights[key]}
            handleChange={(value) =>
              setWeights((prevState) => ({
                ...prevState,
                [key]: parseInt(value),
              }))
            }
          />
        </Grid>
      ))}
    </Box>
  );
};

export default ProcessOverview;

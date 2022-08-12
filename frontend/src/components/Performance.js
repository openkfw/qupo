import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    textAlign: "center",
    paddingTop: theme.spacing(1),
  },
  box: {
    display: "flex",
    justifyContent: "space-around",
  },
  model: {
    fontSize: "16px !important",
    fontWeight: "bold !important",
  },
  valueBox: {
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    padding: `${theme.spacing(1)} 0`,
  },
  value: {
    fontSize: "14px !important",
    fontWeight: "bold !important",
  },
}));

const ValueBox = ({ value, kind, fixed = 0 }) => {
  const classes = useStyles();

  return (
    <Box className={classes.valueBox}>
      <Typography color="primary" className={classes.value}>
        {Number(value).toFixed(fixed)}
      </Typography>
      <Typography variant="button" sx={{ fontSize: 8 }}>
        {kind}
      </Typography>
    </Box>
  );
};

const Performance = ({ model, modelName }) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Typography color="primary" className={classes.model}>
        {modelName.toUpperCase()}
      </Typography>
      <Divider sx={{ mx: 2 }} />
      <ValueBox value={model.objective_value} kind="Performance" fixed={2} />
      <Divider sx={{ mx: 2 }} />
      <Box className={classes.box}>
        <ValueBox value={model.variance} kind="Risk" />
        <ValueBox value={model.esg_value} kind="Sustainability" />
        <ValueBox value={model.rate_of_return} kind="Return" fixed={2} />
      </Box>
    </Box>
  );
};

export default Performance;

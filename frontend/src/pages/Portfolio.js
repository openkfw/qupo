import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";

import PortfolioController from "../components/PortfolioController";
import QuantumDashboard from "../components/QuantumDashboard";
import QuantumPerformance from "../components/QuantumPerformance";

const useStyles = makeStyles((theme) => ({
  box: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#f2f2f2",
    padding: `${theme.spacing(1)} 0`,
  },
}));

const Portfolio = ({ client, data, setData, weights, setWeights }) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={1}
    >
      <PortfolioController
        client={client}
        data={data}
        setData={setData}
        weights={weights}
        setWeights={setWeights}
      />
      <Grid item xs={9}>
        {data && (
          <Card variant="outlined" sx={{ p: 1 }}>
            <QuantumDashboard data={data} />
            <Box className={classes.box}>
              {Object.keys(data).map((model) => (
                <QuantumPerformance
                  key={model}
                  experiment={data[model]}
                  model={model}
                />
              ))}
            </Box>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default Portfolio;

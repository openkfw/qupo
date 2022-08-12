import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";

import PortfolioController from "../components/PortfolioController";
import PortfolioChart from "../components/PortfolioChart";
import Performance from "../components/Performance";

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
        setData={setData}
        weights={weights}
        setWeights={setWeights}
      />
      <Grid item xs={9}>
        {data && (
          <Card variant="outlined" sx={{ p: 1 }}>
            <PortfolioChart data={data} />
            <Box className={classes.box}>
              {Object.keys(data).map((modelName) => (
                <Performance
                  key={modelName}
                  model={data[modelName]}
                  modelName={modelName}
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

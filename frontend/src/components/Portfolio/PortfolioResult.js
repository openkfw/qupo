import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import PortfolioChart from "./PortfolioChart";
import Performance from "./Performance";

import dayjs from "dayjs";

const PortfolioResult = ({ data, timeframe }) => {
  const dateFormat = "DD MMM YYYY";

  return (
    <Card variant="outlined">
      <Grid sx={{ p: 2 }} container justifyContent="flex-end">
        <Typography
          variant="caption"
          sx={{
            color: (theme) => `${theme.palette.grey.main}`,
          }}
        >
          {dayjs(timeframe.start, timeframe.format).format(dateFormat)} to{" "}
          {dayjs(timeframe.end, timeframe.format).format(dateFormat)}
        </Typography>
      </Grid>
      <Grid sx={{ px: 1, pb: 1.3 }}>
        <PortfolioChart data={data} />
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          backgroundColor: (theme) => `${theme.palette.grey.light}`,
          padding: `1 0`,
          marginTop: 0.9,
        }}
      >
        {data.map(({ Calculation, Result }) => (
          <Performance
            key={Calculation.model}
            model={Result}
            modelName={Calculation.model}
          />
        ))}
      </Box>
    </Card>
  );
};

export default PortfolioResult;

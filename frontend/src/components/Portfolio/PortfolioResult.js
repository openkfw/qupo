import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { formatDate } from "../../utils/helpers";
import PortfolioChart from "./PortfolioChart";
import Performance from "./Performance";

const PortfolioResult = ({ data, timeframe }) => {
  return (
    <Card variant="outlined">
      <Grid sx={{ p: 2 }} container justifyContent="flex-end">
        <Typography
          variant="caption"
          sx={{
            color: (theme) => `${theme.palette.grey.main}`,
          }}
        >
          {formatDate(timeframe.start)} to {formatDate(timeframe.end)}
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
        {data.portfolio.map(({ Calculation, Result }) => (
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

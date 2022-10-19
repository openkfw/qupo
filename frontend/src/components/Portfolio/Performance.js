import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const ValueBox = ({ value, kind, fixed = 0, description }) => {
  return (
    <Tooltip title={description} arrow>
      <Box
        sx={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          py: 1,
        }}
      >
        <Typography
          color="primary"
          sx={{
            fontSize: "14px !important",
            fontWeight: "bold !important",
          }}
        >
          {Number(value).toFixed(fixed)}
        </Typography>
        <Typography variant="button" sx={{ fontSize: 8 }}>
          {kind}
        </Typography>
      </Box>
    </Tooltip>
  );
};

const Performance = ({ model, modelName }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        textAlign: "center",
        py: 0.5,
      }}
    >
      <Typography
        color="primary"
        sx={{
          fontSize: "16px !important",
          fontWeight: "bold !important",
          py: 1,
        }}
      >
        {modelName.toUpperCase()}
      </Typography>
      <Divider sx={{ mx: 2 }} />
      <ValueBox
        value={model.objective_value}
        kind="Performance"
        fixed={2}
        description="Overall performance of the portfolio over time."
      />
      <Divider sx={{ mx: 2 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <ValueBox
          value={Math.abs(model.risk)}
          kind="Risk"
          description="Overall risk of the portfolio (portfolio volatility/variance)."
        />
        <ValueBox
          value={model.esg_value}
          kind="Sustainability"
          description="The portfolio's overall sustainability based on the weightend stocks' ESG values."
        />
        <ValueBox
          value={model.rate_of_return_value}
          kind="Return"
          fixed={2}
          description="Expected return of the portfolio over time based on the historical stock data."
        />
      </Box>
    </Box>
  );
};

export default Performance;

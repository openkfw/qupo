import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const ValueBox = ({ value, kind, fixed = 0 }) => {
  return (
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
        paddingTop: 1,
      }}
    >
      <Typography
        color="primary"
        sx={{
          fontSize: "16px !important",
          fontWeight: "bold !important",
          pb: 1,
        }}
      >
        {modelName.toUpperCase()}
      </Typography>
      <Divider sx={{ mx: 2 }} />
      <ValueBox value={model.objective_value} kind="Performance" fixed={2} />
      <Divider sx={{ mx: 2 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <ValueBox value={model.risk} kind="Risk" />
        <ValueBox value={model.esg_value} kind="Sustainability" />
        <ValueBox value={model.rate_of_return_value} kind="Return" fixed={2} />
      </Box>
    </Box>
  );
};

export default Performance;

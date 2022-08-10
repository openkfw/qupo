import React from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

export default function QuantumPerformance({ experiment, model }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "#f2f2f2",
        py: 1,
      }}
    >
      <Typography color="primary" sx={{ fontSize: 16, fontWeight: "bold" }}>
        {model}
      </Typography>
      <Divider sx={{ mx: 2 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          backgroundColor: "#f2f2f2",
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography color="primary" sx={{ fontSize: 14, fontWeight: "bold" }}>
            {Number(experiment.objective_values).toFixed(0)}
          </Typography>
          <Typography variant="button" sx={{ fontSize: 8 }}>
            Performance
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          backgroundColor: "#f2f2f2",
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography color="primary" sx={{ fontSize: 14, fontWeight: "bold" }}>
            {Number(experiment.Variance).toFixed(0)}
          </Typography>
          <Typography variant="button" sx={{ fontSize: 8 }}>
            Risk
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography color="primary" sx={{ fontSize: 14, fontWeight: "bold" }}>
            {Number(experiment.net_impact_ratio).toFixed(0)}
          </Typography>
          <Typography variant="button" sx={{ fontSize: 8 }}>
            Sustainability
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography color="primary" sx={{ fontSize: 14, fontWeight: "bold" }}>
            {Number(experiment.RateOfReturn).toFixed(2)}
          </Typography>
          <Typography variant="button" sx={{ fontSize: 8 }}>
            Return
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

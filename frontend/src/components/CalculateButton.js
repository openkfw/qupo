import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ScienceIcon from "@mui/icons-material/ScienceOutlined";

import store from "store-js";

const CalculateButton = ({ client, weights, data, setData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(
    store.get("selected_symbols").length < 2 ? true : false
  );

  useEffect(() => {
    store.watch("selected_symbols", () => {
      if (store.get("selected_symbols").length < 2) setDisabled(true);
      else setDisabled(false);
    });
  });

  const calculateModels = async () => {
    navigate("/portfolio");
    setLoading(true);
    const symbols = store.get("selected_symbols");
    const d = await client.getModelCalculations(
      [],
      symbols.slice(0, 10),
      weights.risk_weight.value,
      weights.esg_weight.value
    );
    setData(d);
    setLoading(false);
  };

  return (
    <Button
      sx={{ width: "100%" }}
      variant="contained"
      disabled={loading || disabled}
      onClick={calculateModels}
      startIcon={
        loading ? (
          <CircularProgress color="inherit" size={10} />
        ) : (
          <ScienceIcon />
        )
      }
    >
      Calculate
    </Button>
  );
};

export default CalculateButton;

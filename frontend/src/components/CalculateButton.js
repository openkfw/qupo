import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import store from "store-js";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ScienceIcon from "@mui/icons-material/ScienceOutlined";

import { getModelCalculations } from "../api";

const CalculateButton = ({ weights, setData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(store.get("loading"));
  const [disabled, setDisabled] = useState(
    store.get("selected_symbols")?.length < 2 ||
      store.get("selected_models")?.length < 2
      ? true
      : false
  );

  useEffect(() => {
    ["selected_symbols", "selected_models"].map((key) =>
      store.watch(key, () => {
        if (store.get(key).length < 2) setDisabled(true);
        else setDisabled(false);
      })
    );
  });

  useEffect(() => {
    store.watch("loading", () => setLoading(store.get("loading")));
  });

  const calculateModels = async () => {
    navigate("/portfolio");
    store.set("loading", true);
    const symbols = store.get("selected_symbols");
    const models = store.get("selected_models");
    const data = await getModelCalculations(
      models,
      symbols.slice(0, 10).map((symbol) => symbol.symbol),
      weights.risk_weight.value,
      weights.esg_weight.value
    );
    setData(data);
    store.set("loading", false);
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

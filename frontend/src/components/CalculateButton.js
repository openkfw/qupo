import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import store from "store-js";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ScienceIcon from "@mui/icons-material/ScienceOutlined";

import { getModelCalculations } from "../api";

// helper function to check the disabled button, but just for the "disabled" state variable
// based on selected models / symbols
const isCalculateDisabled = () => {
  return store.get("selected_symbols")?.length < 2 ||
    store.get("selected_models")?.length < 1
    ? true
    : false;
};

const CalculateButton = ({ timeframe, weights, setData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(store.get("loading"));
  const [disabled, setDisabled] = useState(isCalculateDisabled());

  useEffect(() => {
    ["selected_symbols", "selected_models"].map((key) =>
      store.watch(key, () => {
        setDisabled(isCalculateDisabled());
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
      weights,
      timeframe
    );
    setData(data);
    store.set("loading", false);
  };

  return (
    <Button
      sx={{ width: "100%" }}
      variant="contained"
      disabled={loading || disabled || !timeframe.isValid}
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

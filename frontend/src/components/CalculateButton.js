import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ScienceIcon from "@mui/icons-material/ScienceOutlined";

import { useTriggerNotification } from "../contexts/NotificationContext";
import { calculateModels } from "../utils/calculation";

import store from "store-js";

// helper function to check the disabled button, but just for the "disabled" state variable
// based on selected models / symbols
const isCalculateDisabled = () => {
  return store.get("selected_symbols")?.length < 2 ||
    store.get("selected_models")?.length < 1
    ? true
    : false;
};

const CalculateButton = ({
  timeframe,
  weights,
  setData,
  handleSeparateCalculation,
}) => {
  const navigate = useNavigate();
  const { addNotification } = useTriggerNotification();
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

  const handleCalculation = async () => {
    if (handleSeparateCalculation) {
      handleSeparateCalculation();
    } else {
      navigate("/portfolio");
      store.set("loading", true);
      setData(undefined);

      try {
        const models = store.get("selected_models");
        const newCalculation = await calculateModels(
          addNotification,
          weights,
          timeframe,
          models
        );

        const calculations = store.get("calculations")
          ? store.get("calculations")
          : [];
        store.set("calculations", [newCalculation, ...calculations]);
        setData(newCalculation);
      } finally {
        store.set("loading", false);
      }
    }
  };

  return (
    <Button
      sx={{ width: "100%" }}
      variant="contained"
      disabled={loading || disabled || !timeframe.isValid}
      onClick={handleCalculation}
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

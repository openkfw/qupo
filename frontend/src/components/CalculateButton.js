import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import store from "store-js";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ScienceIcon from "@mui/icons-material/ScienceOutlined";

import { getModelCalculations } from "../api";
import { useTriggerNotification } from "../contexts/NotificationContext";
import dayjs from "dayjs";

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
  const { addNotification } = useTriggerNotification();

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

  const constructCalculation = (data) => {
    return {
      timestamp: dayjs(),
      models: data.map((model) => model.Calculation.model).join(", "),
      companies: data[0].Calculation.symbol_names.join(", "),
      symbols: data[0].Calculation.symbols.join(", "),
      risk_weight: data[0].Calculation.risk_weight,
      esg_weight: data[0].Calculation.esg_weight,
      start: data[0].Calculation.start,
      end: data[0].Calculation.end,
      data: data,
    };
  };

  const calculateModels = async () => {
    navigate("/portfolio");
    store.set("loading", true);
    setData([]);
    const symbols = store.get("selected_symbols");
    const models = store.get("selected_models");
    const firstTenSymbols = symbols.slice(0, 10).map((symbol) => symbol.symbol);
    try {
      const data = await getModelCalculations(
        models,
        firstTenSymbols,
        weights,
        timeframe
      );

      const rates = data[0]?.Result?.rate_of_return;
      if (rates) {
        const notReturnedSymbols = firstTenSymbols.filter(
          (symbol) => rates[symbol] === undefined
        );
        if (notReturnedSymbols.length) {
          addNotification({
            severity: "warning",
            message: `Symbols not available: ${notReturnedSymbols.join(", ")}`,
          });
        }
      }
      setData(data);

      const calculations = store.get("calculations")
        ? store.get("calculations")
        : [];

      store.set(
        "calculations",
        [constructCalculation(data), ...calculations].slice(0, 30)
      );
    } finally {
      store.set("loading", false);
    }
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

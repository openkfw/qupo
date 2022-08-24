import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ScienceIcon from "@mui/icons-material/ScienceOutlined";

import store from "store-js";
import questions from "../utils/questions.json";

const CalculateButton = ({ client, weights, setData }) => {
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

  const getWeightValue = (weight, value) => {
    return questions
      .find((question) => question.name === weight)
      .options.find((option) => option.percentage === value).weight;
  };

  const calculateModels = async () => {
    navigate("/portfolio");
    store.set("loading", true);
    const symbols = store.get("selected_symbols");
    const models = store.get("selected_models");
    const data = await client.getModelCalculations(
      models,
      symbols.slice(0, 10).map((symbol) => symbol.symbol),
      getWeightValue("risk_weight", weights.risk_weight.value),
      getWeightValue("esg_weight", weights.esg_weight.value)
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

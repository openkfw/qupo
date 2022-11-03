import ScienceIcon from '@mui/icons-material/ScienceOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import store from 'store-js';

import { useTriggerNotification } from '../contexts/NotificationContext';
import { calculateModels } from '../utils/calculation';

// helper function to check the disabled button, but just for the "disabled" state variable
// based on selected models / symbols
const isCalculateDisabled = () => {
  return store.get("selected_symbols")?.length < 2 ||
    store.get("selected_models")?.length < 1
    ? true
    : false;
};

const CalculateButton = ({ timeframe, weights, setData, handleSeparateCalculation }) => {
  const [loading, setLoading] = useState(store.get("loading"));
  const [disabled, setDisabled] = useState(isCalculateDisabled());
  const navigate = useNavigate();
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

  const handleCalculation = async () => {
    if (handleSeparateCalculation) {
      handleSeparateCalculation();
    } else {
      navigate("/portfolio");
      store.set("loading", true);
      setData(undefined);

    try {
      const newCalculation = await calculateModels(addNotification, weights, timeframe)
      setData(newCalculation);

    } finally {
      store.set("loading", false);
    }
  }
  }


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

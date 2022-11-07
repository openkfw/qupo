import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import store from 'store-js';

import { useTriggerNotification } from '../../contexts/NotificationContext';
import { calculateModels, combineCalculations } from '../../utils/calculation';
import CalculateButton from '../CalculateButton';
import SelectModels from '../SelectModels';
import StocksCollection from '../StocksCollection';
import WeightSlider from '../WeightSlider';

const PortfolioController = ({ setData, timeframe, weights, setWeights }) => {
  const navigate = useNavigate();
  const { addNotification } = useTriggerNotification();

  const handleCalculation = async () => {
    navigate("/portfolio");
    store.set("loading", true);
    setData(undefined);

    try {
      const models = store.get("selected_models");
      const quantumModels = [];
      const classicalModels = [];
      let newCalculation;
      models.forEach((model) => {
        if (model === "qiskit" || model === "ionq" || model === "qio") {
          quantumModels.push(model);
        } else {
          classicalModels.push(model);
        }
      });
      if (classicalModels.length) {
        const classicalCalculation = await calculateModels(addNotification, weights, timeframe, classicalModels)
        setData(classicalCalculation)
        newCalculation = classicalCalculation;
      }
      if (quantumModels.length) {
        for (const model of quantumModels) {
          const quantumCalculation = await calculateModels(addNotification, weights, timeframe, [model]);
          newCalculation = combineCalculations(newCalculation, quantumCalculation);
          setData(newCalculation);
        }
      }
      const calculations = store.get("calculations")
        ? store.get("calculations")
        : [];

      store.set("calculations", [newCalculation, ...calculations]);

    } finally {
      store.set("loading", false);
    }
  }

  return (
    <Grid item xs={3}>
      <Card variant="outlined" sx={{ p: 2, mb: 1 }}>
        <Grid sx={{ pr: 1 }}>
          <WeightSlider
            keyWeight="risk_weight"
            weights={weights}
            setWeights={setWeights}
            recalculateModels={handleCalculation}
            size="small"
          />
          <WeightSlider
            keyWeight="esg_weight"
            weights={weights}
            setWeights={setWeights}
            recalculateModels={handleCalculation}
            size="small"
          />
        </Grid>
        <StocksCollection size="small" />
        <SelectModels defaultModels={store.get("selected_models")} />
      </Card>
      <CalculateButton
        timeframe={timeframe}
        weights={weights}
        setData={setData}
        handleSeparateCalculation={handleCalculation}
      />
    </Grid>
  );
};

export default PortfolioController;

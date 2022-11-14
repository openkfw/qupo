import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

import CalculateButton from "../../components/CalculateButton";
import ProcessOverview from "./ProcessOverview";
import ProcessQuestionaire from "./ProcessQuestionaire";

const ProcessFlow = ({
  setData,
  timeframe,
  setTimeframe,
  weights,
  setWeights,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(
    location?.state?.step ? location.state.step : 1
  );

  const steps = [
    "Choose stock symbols",
    "Answer questions for calculation",
    "Continue",
  ];

  const getContent = () => {
    if (currentStep === 1)
      return <ProcessQuestionaire setWeights={setWeights} />;
    else
      return (
        <ProcessOverview
          weights={weights}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          setWeights={setWeights}
        />
      );
  };

  const onBack = () => {
    if (currentStep === 1) navigate("/");
    else setCurrentStep(currentStep - 1);
  };

  return (
    <Grid sx={{ px: 2, mb: 1 }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid sx={{ py: 4 }}>{getContent()}</Grid>
      <Grid container>
        <Grid xs={6} item>
          <Button
            variant="contained"
            onClick={() => onBack()}
            disabled={currentStep === 0}
          >
            Back
          </Button>
        </Grid>
        <Grid xs={6} item>
          <Grid container justifyContent="flex-end">
            {steps.length - 1 !== currentStep ? (
              <Button
                variant="contained"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
              </Button>
            ) : (
              <Grid>
                <CalculateButton
                  timeframe={timeframe}
                  weights={weights}
                  setData={setData}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProcessFlow;

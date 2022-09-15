import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import makeStyles from "@mui/styles/makeStyles";

import CalculateButton from "../../components/CalculateButton";
import ProcessOverview from "./ProcessOverview";
import ProcessQuestionaire from "./ProcessQuestionaire";

const useStyles = makeStyles((theme) => ({
  spacing: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
}));

const ProcessFlow = ({ setData, weights, setWeights }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    "Choose stock symbols",
    "Answer questions for calculation",
    "Continue",
  ];

  const getContent = () => {
    if (currentStep === 1)
      return <ProcessQuestionaire setWeights={setWeights} />;
    else return <ProcessOverview weights={weights} setWeights={setWeights} />;
  };

  const onBack = () => {
    if (currentStep === 1) navigate("/");
    else setCurrentStep(currentStep - 1);
  };

  return (
    <Grid>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid className={classes.spacing}>{getContent()}</Grid>
      <Grid container className={classes.spacing}>
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
                <CalculateButton weights={weights} setData={setData} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProcessFlow;

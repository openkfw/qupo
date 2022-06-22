import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  spacing: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
}));

const ProcessFlow = ({ currentStep, setCurrentStep, ...props }) => {
  const classes = useStyles();
  const steps = [
    "Choose stock symbols",
    "Answer questions for calculation",
    "Continue",
  ];

  return (
    <Grid>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid className={classes.spacing}>{props.children}</Grid>
      <Grid container className={classes.spacing}>
        <Grid xs={6} item>
          <Button
            variant="contained"
            onClick={() => setCurrentStep(currentStep - 1)}
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
              <Button variant="contained">Calculate</Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProcessFlow;

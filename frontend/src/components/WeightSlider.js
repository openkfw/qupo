import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import questions from "../utils/questions.json";

const WeightSlider = ({ keyWeight, weights, setWeights, size = "medium" }) => {
  const styles = {
    "& .MuiSlider-markLabel": {
      fontSize: "0.7rem",
      lineHeight: "0.6rem",
    },
  };

  const marks = [
    {
      value: 0,
      label: "0%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];

  const handleChange = (value) => {
    setWeights((prevState) => weights.setValues(prevState, keyWeight, value));
  };

  const formatLabel = (value) => {
    const characteristic = questions
      .find((question) => question.name === keyWeight)
      ?.options.find((scenario) => scenario.value === value)?.characteristic;
    return characteristic && size !== "small"
      ? `${characteristic}: ${value}%`
      : `${value}%`;
  };

  return (
    <Grid sx={{ pb: 2 }}>
      <Typography id={`input-${keyWeight}`} variant="button">
        <b>{weights[keyWeight].label}</b>
      </Typography>
      <Slider
        key={`slider-${keyWeight}`}
        aria-label="Weight"
        size={size}
        value={weights[keyWeight].value}
        onChange={(_, newValue) => handleChange(newValue)}
        valueLabelDisplay="auto"
        valueLabelFormat={formatLabel}
        sx={size === "small" ? styles : null}
        step={10}
        min={0}
        max={100}
        marks={marks}
      />
    </Grid>
  );
};

export default WeightSlider;

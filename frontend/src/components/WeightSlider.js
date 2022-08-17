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

  const marks = questions
    .find((question) => question.name === keyWeight)
    .options.map((option) => {
      return {
        value: option.percentage,
        label: `${option.percentage}%`,
        characteristic: option.characteristic,
      };
    });

  const handleChange = (value) => {
    setWeights((prevState) => weights.setValues(prevState, keyWeight, value));
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
        valueLabelFormat={(value) =>
          marks.find((mark) => mark.value === value).characteristic
        }
        sx={size === "small" ? styles : null}
        step={null}
        min={0}
        max={100}
        marks={marks.map((mark) => {
          return { value: mark.value, label: mark.label };
        })}
      />
    </Grid>
  );
};

export default WeightSlider;

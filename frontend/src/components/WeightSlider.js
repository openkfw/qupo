import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

const WeightSlider = ({ keyWeight, weights, setWeights, size = "medium" }) => {
  const handleChange = (value) => {
    setWeights((prevState) => weights.setValues(prevState, keyWeight, value));
  };

  return (
    <Grid sx={{ pb: 2 }}>
      <Typography id={`input-${weights[keyWeight].label}`} variant="button">
        <b>{weights[keyWeight].label}</b>
      </Typography>
      <Slider
        key={`slider-${weights[keyWeight].label}`}
        aria-label="Weight"
        size={size}
        defaultValue={weights[keyWeight].value}
        onChange={(_, newValue) => handleChange(newValue)}
        step={10}
        min={0}
        max={100}
        marks={[
          { value: 0, label: "0%" },
          {
            value: weights[keyWeight].value,
            label: `${weights[keyWeight].value}%`,
          },
          { value: 100, label: "100%" },
        ]}
      />
    </Grid>
  );
};

export default WeightSlider;

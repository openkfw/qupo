import Slider from "@mui/material/Slider";

const WeightSlider = ({ weight, handleChange }) => {
  return (
    <Slider
      key={`slider-${weight}`}
      aria-label="Weight"
      defaultValue={weight}
      valueLabelDisplay="auto"
      onChange={(_, newValue) => handleChange(newValue)}
      step={10}
      min={0}
      max={100}
      marks={[{ value: weight, label: weight }]}
    />
  );
};

export default WeightSlider;

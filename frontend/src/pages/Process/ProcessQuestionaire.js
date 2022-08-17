import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

import questions from "../../utils/questions.json";

const ProcesssQuestionaire = ({ setWeights }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setWeights((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name], value: parseInt(value) },
    }));
  };

  return questions.map((question) => (
    <Grid key={question.id} sx={{ p: 2 }}>
      <Typography>
        {question.id}. {question.question}
      </Typography>
      <FormControl>
        <RadioGroup onChange={handleChange}>
          {question.options.map((option) => (
            <FormControlLabel
              key={option.scenario}
              value={option.percentage}
              control={<Radio />}
              name={question.name}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Grid>
  ));
};

export default ProcesssQuestionaire;

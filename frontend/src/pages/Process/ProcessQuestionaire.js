import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";

import questions from "../../utils/questions.json";

const ProcesssQuestionaire = ({ setWeights }) => {
  const explanations = [
    "Risk is an important factor in investing. A portfolio should yield the maximum possible return while maintaining a certain amount of risk.",
    "The sustainability of the portfolio is based on ESG values of the individual stocks. ESG is a rating for companies that measures non-financial factors. It stands for Environment, Social and Governance.",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setWeights((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name], value: parseInt(value) },
    }));
  };

  return questions.map((question) => (
    <Grid sx={{ p: 2 }} key={question.id}>
      <Grid container>
        <b>
          {question.id}. {question.question}
        </b>
        <Tooltip arrow placement="right" title={explanations[question.id - 1]}>
          <InfoIcon fontSize="small" color="grey" sx={{ pl: 1 }} />
        </Tooltip>
      </Grid>
      <Typography>{question.use_case}</Typography>
      <FormControl>
        <RadioGroup onChange={handleChange}>
          {question.options.map((option) => (
            <FormControlLabel
              key={option.scenario}
              value={option.value}
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

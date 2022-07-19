import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  box: {
    paddingTop: theme.spacing(2),
  },
}));

const Search = ({ filter, view, filterValue, setFilterValue }) => {
  const classes = useStyles();

  return (
    <Autocomplete
      value={filterValue}
      options={filter}
      renderInput={(params) => (
        <TextField {...params} label={`Filter by ${view}`} />
      )}
      onChange={(_, value) => setFilterValue(value)}
      className={classes.box}
    />
  );
};

export default Search;

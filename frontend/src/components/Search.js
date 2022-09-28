import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const Search = ({ filter, view, filterValue, setFilterValue }) => {
  return (
    <Autocomplete
      value={filterValue}
      options={filter}
      renderInput={(params) => (
        <TextField {...params} label={`Filter by ${view}`} />
      )}
      onChange={(_, value) => setFilterValue(value)}
      sx={{
        pt: 2,
      }}
    />
  );
};

export default Search;

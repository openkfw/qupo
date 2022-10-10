import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const Search = ({ filter, symbols, view, filterValue, setFilterValue }) => {
  const mappedItems = filter.map((item) => {
    return {
      category: view.toUpperCase(),
      item,
    };
  });

  const mappedSymbolNames = symbols.map((symbol) => {
    return {
      category: "COMPANIES",
      item: symbol.name,
    };
  });

  const mappedSymbols = symbols.map((symbol) => {
    return {
      category: "SYMBOLS",
      item: symbol.symbol,
    };
  });

  return (
    <Autocomplete
      value={filterValue}
      options={[...mappedItems, ...mappedSymbolNames, ...mappedSymbols]}
      groupBy={(option) => option.category}
      isOptionEqualToValue={(option, value) => {
        return option.item === value;
      }}
      getOptionLabel={(option) => {
        return option?.hasOwnProperty("item") ? option.item : option;
      }}
      renderInput={(params) => (
        <TextField {...params} label={`Filter by ${view}`} />
      )}
      onChange={(_, value) =>
        setFilterValue(value?.hasOwnProperty("item") ? value.item : value)
      }
      sx={{ pt: 2, pb: 1 }}
    />
  );
};

export default Search;

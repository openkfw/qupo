import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CircleIcon from '@mui/icons-material/Circle';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import store from 'store-js';

import { fetchAllSymbols, filterUniqueSymbols } from '../utils/helpers';

const checkedIcon = <CheckBoxIcon fontSize="small" />;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

const symbolFilterOptions = createFilterOptions({
  limit: 20,
  stringify: (option) => `${option.symbol} ${option.name}`,
});

const SymbolSearch = ({
  size = "medium",
  selectedSymbols,
  setSelectedSymbols,
  allowMultipleSelection = false,
}) => {
  const [allSymbols, setAllSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [symbolsToAdd, setSymbolsToAdd] = useState([]);

  const maxItemsReached =
    selectedSymbols.length >= 10 || symbolsToAdd.length > 10;
  const addButtonDisabled =
    (allowMultipleSelection && symbolsToAdd.length < 3) || maxItemsReached;

  useEffect(() => {
    async function fetchSymbols() {
      setAllSymbols(await fetchAllSymbols());
    }
    fetchSymbols();
    setLoading(false);
    setSymbolsToAdd([]);
  }, [setSymbolsToAdd]);

  const onAddSymbols = () => {
    const newSymbols = filterUniqueSymbols([
      ...selectedSymbols,
      ...symbolsToAdd,
    ]);
    setSelectedSymbols(newSymbols);
    store.set("selected_symbols", newSymbols);
  };

  const renderCheckboxOptions = (props, option, { selected }) => (
    <Tooltip
      title="There are already 10 symbols selected."
      disableHoverListener={!maxItemsReached}
      key={option.name}
    >
      <li {...props}>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selected}
        />
        <Box key={option.name} {...props}>
          {option.symbol}
          <span style={{ color: "grey" }}>
            <CircleIcon sx={{ fontSize: 8, pl: 2, pr: "5px", pb: "1px" }} />
            {option.name}
          </span>
        </Box>
      </li>
    </Tooltip>
  );

  const renderSingleOption = (props, option) => (
    <Box component="li" key={option.name} {...props}>
      {option.symbol}
      <span style={{ color: "grey" }}>
        <CircleIcon sx={{ fontSize: 8, pl: 2, pr: "5px", pb: "1px" }} />
        {option.name}
      </span>
    </Box>
  );

  return (
    <Stack spacing={2}>
      <Autocomplete
        multiple
        disableCloseOnSelect={allowMultipleSelection}
        options={allSymbols}
        getOptionLabel={(option) => option.symbol}
        renderOption={
          size === "small"
            ? null
            : allowMultipleSelection
            ? renderCheckboxOptions
            : renderSingleOption
        }
        loading={loading}
        filterSelectedOptions={!allowMultipleSelection}
        onChange={(_, value) => setSymbolsToAdd(value)}
        filterOptions={symbolFilterOptions}
        getOptionDisabled={
          allowMultipleSelection
            ? (option) =>
                !symbolsToAdd.includes(option) && symbolsToAdd.length > 9
            : null
        }
        renderInput={(params) => (
          <TextField {...params} label="Find symbols to add" />
        )}
        sx={{ pt: 2, pb: 1, mt: 1 }}
      />
      <Tooltip
        title="There are already 10 symbols selected."
        disableHoverListener={!maxItemsReached}
      >
        <Grid>
          <Button
            disabled={addButtonDisabled}
            variant="contained"
            onClick={onAddSymbols}
            size={size}
            sx={{ width: "100%", mb: 3 }}
          >
            Add
          </Button>
        </Grid>
      </Tooltip>
    </Stack>
  );
};

export default SymbolSearch;

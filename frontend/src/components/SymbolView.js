import { useEffect, useState } from "react";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";

import store from "store-js";

import { getSymbols } from "../api";
import ForwardIcon from "@mui/icons-material/ArrowForward";

const symbolFilterOptions = createFilterOptions({
  limit: 20,
  stringify: (option) => `${option.symbol} ${option.name}`,
});

const SymbolView = ({ size = "medium" }) => {
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [symbolsToAdd, setSymbolsToAdd] = useState([]);
  const [allSymbols, setAllSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const filterUniqueSymbols = (symbols) => {
    return [
      ...new Map(symbols.map((symbol) => [symbol["symbol"], symbol])).values(),
    ];
  };

  useEffect(() => {
    const fetchAllSymbols = async () => {
      const symbols = await getSymbols();
      setAllSymbols(
        filterUniqueSymbols(symbols).sort((a, b) =>
          a.symbol > b.symbol ? 1 : -1
        )
      );
    };

    fetchAllSymbols();
    setLoading(false);
  }, []);

  const onAddSymbols = () => {
    const newSymbols = filterUniqueSymbols([
      ...selectedSymbols,
      ...symbolsToAdd,
    ]);
    setSelectedSymbols(newSymbols);
    store.set("selected_symbols", newSymbols);
    setSymbolsToAdd([]);
  };

  const renderOption = (props, option) => (
    <Box component="li" key={option.name} {...props}>
      {option.symbol}
      <span style={{ color: "grey" }}>
        <CircleIcon sx={{ fontSize: 8, pl: 2, pr: "5px", pb: "1px" }} />
        {option.name}
      </span>
    </Box>
  );

  const addButtonDisabled = selectedSymbols.length > 9;

  return (
    <Grid sx={{ mb: 1, pb: 1 }}>
      <Typography sx={{ mb: 1 }}>Add symbols:</Typography>
      <Stack spacing={2}>
        <Autocomplete
          multiple
          options={allSymbols}
          getOptionLabel={(option) => option.symbol}
          renderOption={size === "small" ? null : renderOption}
          loading={loading}
          filterSelectedOptions
          onChange={(_, value) => setSymbolsToAdd(value)}
          filterOptions={symbolFilterOptions}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Symbols" />
          )}
        />
        <Tooltip
          title="There are already 10 or more symbols selected."
          disableHoverListener={!addButtonDisabled}
        >
          <Grid>
            <Button
              disabled={addButtonDisabled}
              variant="contained"
              onClick={onAddSymbols}
              size={size}
              sx={{ width: "100%" }}
            >
              Add
            </Button>
          </Grid>
        </Tooltip>
        <Grid container justifyContent="flex-end">
          <Button
            size="small"
            startIcon={<ForwardIcon />}
            onClick={() => {
              store.set("selected_symbols", selectedSymbols);
              navigate("/process");
            }}
          >
            Continue with these symbols
          </Button>
        </Grid>
      </Stack>
    </Grid>
  );
};

export default SymbolView;

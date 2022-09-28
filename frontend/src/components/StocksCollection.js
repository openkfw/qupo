import { useEffect, useState } from "react";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import CircleIcon from "@mui/icons-material/Circle";
import { green } from "@mui/material/colors";

import store from "store-js";

import { getSymbols } from "../api";
import CollapsedSection from "./CollapsedSection";

// supply filter options to autocomplete component to customize searching
const symbolFilterOptions = createFilterOptions({
  limit: 20,
  // provide both symbol and name to the search, so it matches both
  stringify: (option) => `${option.symbol} ${option.name}`,
});

const StocksCollection = ({ size = "medium" }) => {
  const [selectedSymbols, setSelectedSymbols] = useState(
    store.get("selected_symbols")
  );
  const [symbolsToAdd, setSymbolsToAdd] = useState([]);
  const [allSymbols, setAllSymbols] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const onDeleteSymbol = (symbol) => {
    const filteredSymbols = selectedSymbols.filter(
      (s) => s.symbol !== symbol.symbol
    );
    setSelectedSymbols(filteredSymbols);
    store.set("selected_symbols", filteredSymbols);
  };

  const onAddSymbols = () => {
    const newSymbols = filterUniqueSymbols([
      ...selectedSymbols,
      ...symbolsToAdd,
    ]);
    setSelectedSymbols(newSymbols);
    store.set("selected_symbols", newSymbols);
    setSymbolsToAdd([]);
  };

  const onDeleteAll = () => {
    store.set("selected_symbols", []);
    setSelectedSymbols([]);
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
    <Grid
      sx={{
        mb: 1,
        pb: 1,
      }}
    >
      <Grid
        sx={{
          border: "1px solid",
          borderRadius: "2px",
          borderColor: (theme) => `${theme.palette.grey.middle}`,
          padding: 1,
          marginBottom: 2,
        }}
      >
        <CollapsedSection
          heading={
            <Button size="small" onClick={onDeleteAll}>
              Delete
            </Button>
          }
          collapsedSize={100}
          size="small"
        >
          <Grid container>
            {selectedSymbols.map((symbol, index) => (
              <Grid
                key={symbol.name}
                sx={{
                  pb: 1,
                  pr: 1,
                }}
                item
              >
                <Tooltip title={symbol.name}>
                  <Chip
                    label={symbol.symbol}
                    size="small"
                    onDelete={() => onDeleteSymbol(symbol)}
                    avatar={
                      index < 10 ? (
                        <CheckIcon
                          color="white"
                          style={{ color: green[500] }}
                        />
                      ) : null
                    }
                  />
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </CollapsedSection>
      </Grid>
      <Typography
        sx={{
          mb: 1,
          pb: 1,
        }}
      >
        Add symbols:
      </Typography>
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
        <Button
          disabled={addButtonDisabled}
          variant="contained"
          onClick={onAddSymbols}
        >
          {addButtonDisabled ? "More than 10 symbols selected" : "Add"}
        </Button>
      </Stack>
    </Grid>
  );
};

export default StocksCollection;

import { useEffect, useState } from "react";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import CollapsedSection from "./CollapsedSection";
import Chip from "@mui/material/Chip";
import CheckIcon from "@mui/icons-material/Check";
import { green } from "@mui/material/colors";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import store from "store-js";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import { getSymbols } from "../api";
import ForwardIcon from "@mui/icons-material/ArrowForward";

const checkedIcon = <CheckBoxIcon fontSize="small" />;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

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
  };

  const onDeleteAll = () => {
    store.set("selected_symbols", []);
    setSelectedSymbols([]);
  };

  const onDeleteSymbol = (symbol) => {
    const filteredSymbols = selectedSymbols.filter(
      (s) => s.symbol !== symbol.symbol
    );
    setSelectedSymbols(filteredSymbols);
    store.set("selected_symbols", filteredSymbols);
  };

  const renderOption = (props, option, { selected }) => (
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
  const maxItemsReached =
    selectedSymbols.length >= 10 || symbolsToAdd.length > 10;
  const addButtonDisabled = !symbolsToAdd.length || maxItemsReached;
  const areSymbolsSelected = selectedSymbols.length > 0;

  return (
    <Grid sx={{ mb: 1, pb: 1 }}>
      <Stack spacing={2}>
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={allSymbols}
          getOptionLabel={(option) => option.symbol}
          renderOption={size === "small" ? null : renderOption}
          loading={loading}
          onChange={(_, value) => setSymbolsToAdd(value)}
          filterOptions={symbolFilterOptions}
          getOptionDisabled={(option) =>
            !symbolsToAdd.includes(option) && symbolsToAdd.length > 9
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
      <Grid
        sx={{
          border: "1px solid",
          borderRadius: "2px",
          borderColor: "grey.middle",
          padding: 1,
          marginBottom: 2,
        }}
      >
        <CollapsedSection
          heading={
            <Button
              size="small"
              disabled={!areSymbolsSelected}
              onClick={onDeleteAll}
            >
              Delete
            </Button>
          }
          collapsedSize={100}
          size="small"
        >
          <Grid container>
            {selectedSymbols.map((symbol, index) => (
              <Grid key={symbol.name} sx={{ pb: 1, pr: 1 }} item>
                <Tooltip title={size === "small" ? symbol.name : symbol.symbol}>
                  <Chip
                    label={size === "small" ? symbol.symbol : symbol.name}
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
      <Grid container justifyContent="flex-end">
        <Button
          size="small"
          disabled={!areSymbolsSelected}
          startIcon={<ForwardIcon />}
          onClick={() => {
            store.set("selected_symbols", selectedSymbols);
            navigate("/process");
          }}
        >
          Continue with these symbols
        </Button>
      </Grid>
    </Grid>
  );
};

export default SymbolView;

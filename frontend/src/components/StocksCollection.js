import { useEffect, useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import CheckIcon from "@mui/icons-material/Check";
import { green } from "@mui/material/colors";

import store from "store-js";

import CollapsedSection from "./CollapsedSection";

const useStyles = makeStyles((theme) => ({
  spacing: {
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  collapsed: {
    border: "1px solid",
    borderRadius: "2px",
    borderColor: theme.palette.grey.middle,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  chipBox: {
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const StocksCollection = ({ client }) => {
  const classes = useStyles();
  const [selectedSymbols, setSelectedSymbols] = useState(
    store.get("selected_symbols")
  );
  const [symbolsToAdd, setSymbolsToAdd] = useState([]);
  const [allSymbols, setAllSymbols] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSymbols = async () => {
      const symbols = await client.getSymbols();
      setAllSymbols([...new Set(symbols)]);
    };

    fetchAllSymbols();
    setLoading(false);
  }, [client]);

  const onDeleteSymbol = (symbol) => {
    const filteredSymbols = selectedSymbols.filter((s) => s !== symbol);
    setSelectedSymbols(filteredSymbols);
    store.set("selected_symbols", filteredSymbols);
  };

  const onAddSymbols = () => {
    const newSymbols = [...new Set([...selectedSymbols, ...symbolsToAdd])];
    setSelectedSymbols(newSymbols);
    store.set("selected_symbols", newSymbols);
    setSymbolsToAdd([]);
  };

  const onDeleteAll = () => {
    store.set("selected_symbols", []);
    setSelectedSymbols([]);
  };

  return (
    <Grid className={classes.spacing}>
      <Grid className={classes.collapsed}>
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
              <Grid key={symbol} className={classes.chipBox} item>
                <Chip
                  label={symbol}
                  size="small"
                  onDelete={() => onDeleteSymbol(symbol)}
                  avatar={
                    index < 10 ? (
                      <CheckIcon color="white" style={{ color: green[500] }} />
                    ) : null
                  }
                />
              </Grid>
            ))}
          </Grid>
        </CollapsedSection>
      </Grid>
      <Typography className={classes.spacing}>Add symbols:</Typography>
      <Stack spacing={2}>
        <Autocomplete
          multiple
          options={allSymbols}
          getOptionLabel={(option) => option}
          loading={loading}
          filterSelectedOptions
          onChange={(_, value) => setSymbolsToAdd(value)}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Symbols" />
          )}
        />
        <Button
          disabled={selectedSymbols.length > 9 ? true : false}
          variant="contained"
          onClick={onAddSymbols}
        >
          Add
        </Button>
      </Stack>
    </Grid>
  );
};

export default StocksCollection;

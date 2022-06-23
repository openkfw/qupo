import { useEffect, useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import makeStyles from "@mui/styles/makeStyles";

import CollapsedSection from "./CollapsedSection";

const useStyles = makeStyles((theme) => ({
  spacing: {
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(1),
  },
  collapsed: {
    border: "1px solid",
    borderRadius: "2px",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  chipBox: {
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const StocksCollection = ({ client, selectedSymbols, setSelectedSymbols }) => {
  const classes = useStyles();
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
    setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
  };

  const onAddSymbols = () => {
    setSelectedSymbols([...new Set([...selectedSymbols, ...symbolsToAdd])]);
    setSymbolsToAdd([]);
  };

  return (
    <Grid className={classes.spacing}>
      <Grid className={classes.collapsed}>
        <CollapsedSection heading={<div />} collapsedSize={100}>
          <Grid container>
            {selectedSymbols.map((symbol) => (
              <Grid key={symbol} className={classes.chipBox} item>
                <Chip label={symbol} onDelete={() => onDeleteSymbol(symbol)} />
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
          renderInput={(params) => <TextField {...params} label="Symbols" />}
        />
        <Button variant="contained" onClick={onAddSymbols}>
          Add
        </Button>
      </Stack>
    </Grid>
  );
};

export default StocksCollection;

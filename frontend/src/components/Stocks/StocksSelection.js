import { useState } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import SelectedSymbolsBox from "./SelectedSymbolsBox";
import SymbolsSearch from "./SymbolsSearch";

import store from "store-js";

const StocksSelection = ({ size = "medium" }) => {
  const [selectedSymbols, setSelectedSymbols] = useState(
    store.get("selected_symbols")
  );

  return (
    <Grid sx={{ mb: 1, pb: 1 }}>
      <SelectedSymbolsBox
        selectedSymbols={selectedSymbols}
        setSelectedSymbols={setSelectedSymbols}
        size={size}
      />
      <Typography sx={{ mb: 1 }}>Add symbols:</Typography>
      <SymbolsSearch
        selectedSymbols={selectedSymbols}
        setSelectedSymbols={setSelectedSymbols}
        size={size}
      />
    </Grid>
  );
};

export default StocksSelection;

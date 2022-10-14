import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import store from 'store-js';

import SymbolDelete from './SymbolDelete';
import SymbolSearch from './SymbolSelection';

const StocksCollection = ({ size = "medium" }) => {
  const [selectedSymbols, setSelectedSymbols] = useState(
    store.get("selected_symbols")
  );

  return (
    <Grid sx={{ mb: 1, pb: 1 }}>
      <SymbolDelete
        selectedSymbols={selectedSymbols}
        setSelectedSymbols={setSelectedSymbols}
        size={size}
      />

      <Typography sx={{ mb: 1 }}>Add symbols:</Typography>
      <SymbolSearch
        selectedSymbols={selectedSymbols}
        setSelectedSymbols={setSelectedSymbols}
        size={size}
      />
    </Grid>
  );
};

export default StocksCollection;

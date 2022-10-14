import Grid from '@mui/material/Grid';
import { useState } from 'react';

import ContinueButton from './ContinueButton';
import SymbolDelete from './SymbolDelete';
import SymbolSearch from './SymbolSelection';

const SymbolView = ({ size = "medium" }) => {
  const [selectedSymbols, setSelectedSymbols] = useState([]);

  const areSymbolsSelected = selectedSymbols.length > 0;

  return (
    <Grid sx={{ mb: 1, pb: 1 }}>
      <SymbolSearch
        selectedSymbols={selectedSymbols}
        setSelectedSymbols={setSelectedSymbols}
        allowMultipleSelection={true}
        size={size}
      />
      <SymbolDelete
        selectedSymbols={selectedSymbols}
        setSelectedSymbols={setSelectedSymbols}
        areSymbolsSelected={areSymbolsSelected}
        size={size}
      />
      <ContinueButton
        symbols={selectedSymbols}
        areSymbolsSelected={areSymbolsSelected}
      />
    </Grid>
  );
};

export default SymbolView;

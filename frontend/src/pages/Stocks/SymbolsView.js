import { useState } from "react";

import Grid from "@mui/material/Grid";

import ContinueButton from "../../components/ContinueButton";
import SelectedSymbolsBox from "../../components/Stocks/SelectedSymbolsBox";
import SymbolsSearch from "../../components/Stocks/SymbolsSearch";

const SymbolsView = ({ size = "medium" }) => {
  const [selectedSymbols, setSelectedSymbols] = useState([]);

  const areSymbolsSelected = selectedSymbols.length > 0;

  return (
    <Grid sx={{ mb: 1, pb: 1 }}>
      <SymbolsSearch
        selectedSymbols={selectedSymbols}
        setSelectedSymbols={setSelectedSymbols}
        allowMultipleSelection={true}
        size={size}
      />
      <SelectedSymbolsBox
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

export default SymbolsView;

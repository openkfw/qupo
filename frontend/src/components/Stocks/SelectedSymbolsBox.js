import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";

import CheckIcon from "@mui/icons-material/Check";
import { green } from "@mui/material/colors";

import store from "store-js";

import CollapsedSection from "../CollapsedSection";

const SelectedSymbolsBox = ({
  size = "medium",
  selectedSymbols,
  setSelectedSymbols,
  areSymbolsSelected = true,
}) => {
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

  return (
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
                      <CheckIcon color="white" style={{ color: green[500] }} />
                    ) : null
                  }
                />
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </CollapsedSection>
    </Grid>
  );
};

export default SelectedSymbolsBox;

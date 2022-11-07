import { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { filterUniqueSymbols } from "../../utils/helpers";
import views from "../../utils/views";

import Controllers from "../../components/Controllers";
import Search from "../../components/Search";
import InfoDialog from "../../components/Stocks/InfoDialog";
import SymbolsCard from "../../components/Stocks/SymbolsCard";
import SymbolsView from "./SymbolsView";

import store from "store-js";

const Stocks = () => {
  const [view, setView] = useState(views[0].value);
  const allItems = store.get(view);
  const [filter, setFilter] = useState([]);
  const [uniqueSymbols, setUniqueSymbols] = useState([]);
  const [filterValue, setFilterValue] = useState(null);
  const [items, setItems] = useState([]);
  const [info, setInfo] = useState(undefined);

  useEffect(() => {
    if (store.get(view)) {
      setItems(store.get(view).slice(0, 8));
      setFilterValue(null);
      const symbols = store.get("symbols");
      if (symbols) {
        setUniqueSymbols(
          filterUniqueSymbols(symbols).sort((a, b) =>
            a.symbol > b.symbol ? 1 : -1
          )
        );
      }
      setFilter(store.get(view));
    }
  }, [view]);

  const resetView = (view) => {
    setItems(store.get(view).slice(0, 8));
    setView(view);
  };

  const filterItems = (items) => {
    return filterValue !== null
      ? allItems.filter(
          (item) =>
            item === filterValue || itemContainsSymbol(item, filterValue)
        )
      : items;
  };

  const itemContainsSymbol = (item, filterValue) => {
    const symbolsForItem = store.get(item);
    if (symbolsForItem.detail === "Not Found") {
      return false;
    }

    const includesSymbol = symbolsForItem.find(
      (symbol) => symbol.symbol === filterValue || symbol.name === filterValue
    );

    return includesSymbol;
  };

  return (
    <>
      <Controllers view={view} setView={resetView} />
      {view !== "symbols" ? (
        <>
          <Search
            view={view}
            filter={filter}
            symbols={uniqueSymbols}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
          <Box>
            <TransitionGroup>
              {filterItems(items).map((item) => (
                <Collapse key={item}>
                  <SymbolsCard
                    key={item}
                    name={item}
                    filterValue={filterValue}
                    setInfo={setInfo}
                  />
                </Collapse>
              ))}
            </TransitionGroup>
            {info && <InfoDialog info={info} setInfo={setInfo} />}
          </Box>
          {filterValue === null && items?.length !== allItems?.length && (
            <Grid justifyContent="center" container direction="row">
              <IconButton onClick={() => setItems(allItems)}>
                <ExpandMoreIcon fontSize="medium" />
              </IconButton>
            </Grid>
          )}
        </>
      ) : (
        <SymbolsView />
      )}
    </>
  );
};

export default Stocks;

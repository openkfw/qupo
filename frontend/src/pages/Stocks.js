import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import makeStyles from "@mui/styles/makeStyles";

import store from "store-js";
import { TransitionGroup } from "react-transition-group";

import views from "../utils/views";
import Controllers from "../components/Controllers";
import Search from "../components/Search";
import SymbolsListItem from "../components/SymbolsListItem";

const useStyles = makeStyles((theme) => ({
  box: {
    padding: `${theme.spacing(2)} 0`,
  },
  item: {
    paddingBottom: theme.spacing(2),
  },
}));

const Stocks = () => {
  const classes = useStyles();
  const [view, setView] = useState(views[0].value);
  const allItems = store.get(view);
  const [filter, setFilter] = useState([]);
  const [filterValue, setFilterValue] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(store.get(view).slice(0, 8));
    setFilterValue(null);
    setFilter(store.get(view));
  }, [view]);

  const filterItems = (items) => {
    return filterValue !== null
      ? allItems.filter((item) => item === filterValue)
      : items;
  };

  return (
    <>
      <Controllers view={view} setView={setView} />
      <Search
        view={view}
        filter={filter}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      <Box className={classes.box}>
        <TransitionGroup>
          {filterItems(items).map((item) => (
            <Collapse key={item} className={classes.item}>
              <SymbolsListItem
                key={item}
                name={item}
                symbols={store.get(item)}
              />
            </Collapse>
          ))}
        </TransitionGroup>
      </Box>
      {filterValue === null && items.length !== allItems.length && (
        <Grid justifyContent="center" container direction="row">
          <IconButton onClick={() => setItems(allItems)}>
            <ExpandMoreIcon fontSize="medium" />
          </IconButton>
        </Grid>
      )}
    </>
  );
};

export default Stocks;

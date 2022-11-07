import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import store from "store-js";

import CollapsedSection from "../CollapsedSection";
import ContinueButton from "../ContinueButton";

const SymbolsCard = ({ name, filterValue, setInfo }) => {
  const [symbols, setSymbols] = useState(store.get(name));

  useEffect(() => {
    store.watch(name, () => setSymbols(store.get(name)));
  });

  const symbolFound = () => {
    if (symbols?.detail === "Not Found") {
      return false;
    }

    const includesSymbol = symbols.find(
      (symbol) =>
        filterValue !== "" &&
        (symbol.symbol === filterValue || symbol.name === filterValue)
    );

    return includesSymbol;
  };

  return (
    <Card sx={{ my: 1 }}>
      <CardContent sx={{ bgcolor: "grey.light" }}>
        <CollapsedSection
          collapse={symbolFound() ? true : false}
          heading={
            <Box
              sx={{
                fontSize: 34,
                marginTop: 1,
                marginBottom: 2,
              }}
            >
              {name}
            </Box>
          }
        >
          {symbols ? (
            <Grid container>
              {symbols.map((symbol, index) => (
                <Grid
                  key={`${symbol.symbol}-${symbol.name}`}
                  item
                  sx={{ pr: 0.5 }}
                >
                  <Tooltip title={symbol.symbol} arrow>
                    <Typography
                      color="text.secondary"
                      onClick={() => setInfo(symbol)}
                      sx={{
                        fontSize: 14,
                        display: "inline",
                        "&:hover": {
                          textShadow: "0 0 0.01px black",
                          cursor: "pointer",
                        },
                        fontWeight:
                          symbol.symbol === filterValue ||
                          symbol.name === filterValue
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {symbol.name}
                    </Typography>
                  </Tooltip>
                  {!(index === symbols.length - 1) ? (
                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: 14,
                        display: "inline",
                      }}
                    >
                      ,
                    </Typography>
                  ) : null}
                </Grid>
              ))}
            </Grid>
          ) : (
            <CircularProgress size="2rem" />
          )}
        </CollapsedSection>
      </CardContent>
      <CardActions>
        <ContinueButton symbols={symbols} />
      </CardActions>
    </Card>
  );
};

export default SymbolsCard;

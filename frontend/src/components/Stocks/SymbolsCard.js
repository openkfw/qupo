import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import store from "store-js";

import CollapsedSection from "../CollapsedSection";
import ContinueButton from "../ContinueButton";

const SymbolsCard = ({ name, filterValue }) => {
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
            symbols.map((symbol, index) => {
              const expression =
                index === symbols.length - 1 ? symbol.name : `${symbol.name}, `;
              return (
                <Tooltip
                  title={symbol.symbol}
                  key={`${symbol.symbol}-${symbol.name}`}
                >
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: 14,
                      display: "inline",
                      fontWeight:
                        symbol.symbol === filterValue ||
                        symbol.name === filterValue
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {expression}
                  </Typography>
                </Tooltip>
              );
            })
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ForwardIcon from "@mui/icons-material/ArrowForward";

import store from "store-js";

import CollapsedSection from "./CollapsedSection";

const SymbolsListItem = ({ name, filterValue }) => {
  const navigate = useNavigate();
  const [symbols, setSymbols] = useState(store.get(name));

  useEffect(() => {
    store.watch(name, () => setSymbols(store.get(name)));
  });

  return (
    <Card sx={{ my: 1 }}>
      <CardContent sx={{ bgcolor: "grey.light" }}>
        <CollapsedSection
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
          filterValue={filterValue}
          symbols={symbols}
        >
          {symbols ? (
            symbols.map((symbol, index) => {
              const expression =
                index === symbols.length - 1
                  ? symbol.name
                  : `${symbol.name}, `;
              return (
                <Tooltip title={symbol.symbol} key={`${symbol.symbol}-${symbol.name}`}>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: 14, display: "inline", fontWeight: symbol.symbol === filterValue || symbol.name === filterValue ? 'bold' : 'normal' }}
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
        <Grid container justifyContent="flex-end">
          <Button
            size="small"
            startIcon={<ForwardIcon />}
            onClick={() => {
              store.set("selected_symbols", symbols);
              navigate("/process");
            }}
          >
            Continue with these symbols
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default SymbolsListItem;

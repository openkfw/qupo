import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ForwardIcon from "@mui/icons-material/ArrowForward";
import makeStyles from "@mui/styles/makeStyles";

import store from "store-js";

import CollapsedSection from "./CollapsedSection";

const useStyles = makeStyles((theme) => ({
  card: { backgroundColor: theme.palette.grey.light },
  box: {
    fontSize: 34,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  symbols: {
    display: "inline",
  },
}));

const SymbolsListItem = ({ name, symbols }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className={classes.card}>
        <CollapsedSection heading={<Box className={classes.box}>{name}</Box>}>
          {symbols.map((symbol, index) => {
            const expression =
              index === symbols.length - 1
                ? symbol.symbol
                : `${symbol.symbol}, `;
            return (
              <Tooltip title={symbol.name} key={symbol.name}>
                <Typography
                  color="text.secondary"
                  className={classes.symbols}
                  sx={{ fontSize: 14 }}
                >
                  {expression}
                </Typography>
              </Tooltip>
            );
          })}
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

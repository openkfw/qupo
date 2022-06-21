import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardContent,
  Collapse,
  Grid,
  CardActions,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import makeStyles from "@mui/styles/makeStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ForwardIcon from "@mui/icons-material/ArrowForward";

const useStyles = makeStyles((theme) => ({
  card: { backgroundColor: theme.palette.grey.light },
  box: {
    fontSize: 34,
    margin: `${theme.spacing(1)} 0`,
  },
  symbols: {
    display: "inline",
  },
  expandButton: {
    padding: theme.spacing(1),
  },
}));

const CustomListItem = ({ fetchSymbols, kind, name, setView }) => {
  const classes = useStyles();
  const [symbols, setSymbols] = useState([]);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const fetchSymbolsOfName = async () => {
      const s = await fetchSymbols(name);
      setSymbols(s);
    };

    fetchSymbolsOfName();
  }, [name, fetchSymbols]);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <Card>
      <CardContent className={classes.card}>
        <Grid container>
          <Grid xs={6} item>
            <Typography color="text.secondary">{kind}</Typography>
            <Box className={classes.box}>{name}</Box>
          </Grid>
          <Grid item xs={6} className={classes.expandButton}>
            <Grid container justifyContent="flex-end">
              <IconButton onClick={toggleExpand}>
                <ExpandMoreIcon
                  fontSize="medium"
                  style={{
                    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
                  }}
                />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Collapse in={expand} collapsedSize={38}>
          {symbols?.map((symbol) => (
            <Typography
              key={symbol}
              color="text.secondary"
              className={classes.symbols}
              sx={{ fontSize: 14 }}
            >
              {symbol}{" "}
            </Typography>
          ))}
        </Collapse>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="flex-end">
          <Button
            size="small"
            startIcon={<ForwardIcon />}
            onClick={() => setView("chart")}
          >
            Continue with these symbols
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default CustomListItem;

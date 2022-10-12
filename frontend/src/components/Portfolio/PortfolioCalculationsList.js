import { useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { formatDate, shortenString } from "../../utils/helpers";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const DetailsBox = ({ value, name }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        background: "transparent",
        height: "55px",
        px: 1,
        py: 0.5,
        mr: 1,
      }}
    >
      <Typography
        color="text.primary"
        sx={{ fontSize: "20px" }}
        textAlign="center"
      >
        {value}
      </Typography>
      <Typography color="text.secondary" textAlign="center">
        {name}
      </Typography>
    </Card>
  );
};

const PortfolioCalculationsList = ({ calculations, data, setData }) => {
  const [items, setItems] = useState(calculations.slice(0, 5));

  const isSameCalculation = (calculation1, calculation2) => {
    if (calculation1) {
      return dayjs(calculation1.timestamp).isSame(calculation2.timestamp);
    }
    return false;
  };

  return (
    <>
      <Stack spacing={2} sx={{ mt: 2, ml: 1, width: "100%" }}>
        {items.map((calculation, index) => {
          const isSelected = isSameCalculation(data, calculation);
          return (
            <Card
              key={index}
              onClick={() => setData(calculation)}
              sx={{
                cursor: "pointer",
                "&:hover": { bgcolor: "grey.light" },
                boxShadow: isSelected ? "0px 0px 10px black" : "",
              }}
            >
              <CardContent
                sx={{ bgcolor: "primary.dark", color: "white", py: 1.5 }}
              >
                <Grid container>
                  <Grid xs={6} item>
                    <Typography sx={{ fontSize: 14, color: "grey.light" }}>
                      Models
                    </Typography>
                  </Grid>
                  <Grid xs={6} item>
                    <Grid container justifyContent="flex-end">
                      <Typography sx={{ fontSize: 14, color: "grey.light" }}>
                        {dayjs(calculation.timestamp).fromNow()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Typography variant="h5">{calculation.models}</Typography>
              </CardContent>
              <CardContent
                sx={{
                  pt: 1.5,
                  "&.MuiCardContent-root": { paddingBottom: 1.5 },
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  divider={<Divider orientation="vertical" flexItem />}
                >
                  <Grid
                    container
                    sx={{ maxWidth: "46%", alignItems: "center" }}
                  >
                    <Tooltip title={calculation.symbols}>
                      <Typography variant="body2">
                        {shortenString(calculation.companies, 180)}
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid
                    container
                    sx={{ minWidth: "51%", alignItems: "center" }}
                    justifyContent="flex-end"
                  >
                    <DetailsBox
                      value={`${calculation.risk_weight}%`}
                      name="Risk"
                    />
                    <DetailsBox
                      value={`${calculation.esg_weight}%`}
                      name="ESG"
                    />
                    <DetailsBox
                      value={formatDate(calculation.start)}
                      name="Start"
                    />
                    <DetailsBox
                      value={formatDate(calculation.end)}
                      name="End"
                    />
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
      {calculations.length >= 5 && calculations.length !== items.length && (
        <Grid justifyContent="center" container direction="row" sx={{ mt: 2 }}>
          <IconButton onClick={() => setItems(calculations)}>
            <ExpandMoreIcon fontSize="medium" />
          </IconButton>
        </Grid>
      )}
    </>
  );
};

export default PortfolioCalculationsList;

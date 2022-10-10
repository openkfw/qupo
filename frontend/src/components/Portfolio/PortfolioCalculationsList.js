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
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useState } from "react";
dayjs.extend(relativeTime);

const DetailsBox = ({ value, name }) => {
  return (
    <Card variant="outlined" sx={{ px: 1, py: 0.5, mr: 1, mb: 1 }}>
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

const PortfolioCalculationsList = ({ calculations, setData }) => {
  const [items, setItems] = useState(calculations.slice(0, 5));

  return (
    <>
      <Stack spacing={2} sx={{ mt: 2, ml: 1 }}>
        {items.map((calculation, index) => (
          <Card
            key={index}
            onClick={() => setData(calculation.data)}
            sx={{ cursor: "pointer", "&:hover": { bgcolor: "grey.light" } }}
          >
            <CardContent sx={{ bgcolor: "primary.dark", color: "white" }}>
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
            <CardContent>
              <Stack
                direction="row"
                spacing={4}
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Grid sx={{ maxWidth: "41%" }}>
                  <Tooltip title={calculation.symbols}>
                    <Typography variant="body2">
                      {shortenString(calculation.companies, 180)}
                    </Typography>
                  </Tooltip>
                </Grid>
                <Grid container sx={{ maxWidth: "59%" }}>
                  <DetailsBox
                    value={`${calculation.risk_weight}%`}
                    name="Risk"
                  />
                  <DetailsBox value={`${calculation.esg_weight}%`} name="ESG" />
                  <DetailsBox
                    value={formatDate(calculation.start)}
                    name="Start"
                  />
                  <DetailsBox value={formatDate(calculation.end)} name="End" />
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      {calculations.length !== items.length && (
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

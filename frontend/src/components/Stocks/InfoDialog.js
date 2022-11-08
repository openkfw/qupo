import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";

const InfoBox = ({ infoKind, infoValue }) => {
  return (
    <>
      <p />
      <Typography sx={{ color: "grey.main" }} variant="button">
        {infoKind}
      </Typography>
      <br />
      <Typography sx={{ color: "grey.dark" }} variant="body">
        {infoValue}
      </Typography>
    </>
  );
};

const InfoDialog = ({ info, setInfo }) => {
  return (
    <Dialog open={info ? true : false}>
      <IconButton
        sx={{
          position: "absolute",
          color: "grey.main",
          right: "8px",
          top: "8px",
        }}
        onClick={() => setInfo(undefined)}
        size="large"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <Paper sx={{ p: 2.5, minWidth: "30vw" }}>
        <Typography sx={{ color: "grey.dark", pr: 5 }} variant="h5">
          {info.name}
        </Typography>
        <Typography sx={{ color: grey[600] }}>Symbol: {info.symbol}</Typography>
        <p />
        {info.metadata.founded ? (
          <Typography sx={{ color: "grey.dark" }} variant="body2">
            Founded in the year {info.metadata["founded"]}. Number of employees:{" "}
            {info.metadata["employees"]}.
          </Typography>
        ) : null}
        <InfoBox infoKind="Country" infoValue={info.country} />
        {info.industries.length ? (
          <InfoBox
            infoKind="Industries"
            infoValue={info.industries.join(", ")}
          />
        ) : null}
        <InfoBox infoKind="Indices" infoValue={info.indices.join(", ")} />
        {info.isins.length ? (
          <InfoBox infoKind="ISINS" infoValue={info.isins.join(", ")} />
        ) : null}
      </Paper>
    </Dialog>
  );
};

export default InfoDialog;

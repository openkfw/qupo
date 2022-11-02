import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ForwardIcon from "@mui/icons-material/ArrowForward";

import store from "store-js";

const ContinueButton = ({ symbols, areSymbolsSelected = true, view = "" }) => {
  const navigate = useNavigate();

  const isDisabled = symbols.length < 2 && view === "symbols";

  return (
    <Grid container justifyContent="flex-end">
      <Button
        size="small"
        disabled={!areSymbolsSelected || isDisabled}
        startIcon={<ForwardIcon />}
        onClick={() => {
          store.set("selected_symbols", symbols);
          navigate("/process");
        }}
      >
        Continue with these symbols
      </Button>
    </Grid>
  );
};

export default ContinueButton;

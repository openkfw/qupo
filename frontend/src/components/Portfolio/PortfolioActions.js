import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestartIcon from "@mui/icons-material/Replay";

const PortfolioActions = ({ resetProcess }) => {
  const navigate = useNavigate();

  return (
    <Grid container sx={{ mt: -5, pl: 1 }}>
      <Grid sx={{ pt: 1 }}>
        <Button
          color="grey"
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/process", { state: { step: 2 } })}
        >
          Back
        </Button>
      </Grid>
      <Grid sx={{ marginLeft: "auto" }} item>
        <Grid container justifyContent="flex-end">
          <Tooltip title="Restart process">
            <IconButton
              onClick={() => {
                resetProcess();
                navigate("/");
              }}
            >
              <RestartIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PortfolioActions;

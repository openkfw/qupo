import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RestartIcon from "@mui/icons-material/Replay";

const RestartButton = ({ resetProcess }) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default RestartButton;

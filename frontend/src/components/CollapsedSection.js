import { useState } from "react";

import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  expandButton: {
    padding: theme.spacing(1),
  },
}));

const CollapsedSection = ({ heading, collapsedSize = 38, ...props }) => {
  const classes = useStyles();
  const [expand, setExpand] = useState(false);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <>
      <Grid container>
        <Grid xs={6} item>
          {heading}
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
      <Collapse in={expand} collapsedSize={collapsedSize}>
        {props.children}
      </Collapse>
    </>
  );
};

export default CollapsedSection;

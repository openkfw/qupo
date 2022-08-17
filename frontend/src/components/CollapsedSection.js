import { useState } from "react";

import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CollapsedSection = ({
  heading,
  collapsedSize = 38,
  size = "medium",
  ...props
}) => {
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
        <Grid item xs={6}>
          <Grid container justifyContent="flex-end">
            <IconButton onClick={toggleExpand}>
              <ExpandMoreIcon
                fontSize={size}
                style={{
                  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
                }}
              />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Collapse
        in={expand}
        collapsedSize={collapsedSize}
        sx={{ overflowY: "auto" }}
      >
        {props.children}
      </Collapse>
    </>
  );
};

export default CollapsedSection;

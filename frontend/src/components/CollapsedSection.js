import { useState, useEffect } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

const CollapsedSection = ({
  heading,
  collapsedSize = 38,
  size = "medium",
  filterValue,
  symbols,
  ...props
}) => {
  const [expand, setExpand] = useState(false);

  const symbolFound = () => {
    if (symbols.detail === "Not Found") {
      return false
    }
    const includesSymbol = symbols.find(symbol =>
      filterValue !== "" && (symbol.symbol === filterValue || symbol.name === filterValue)
    )
    return includesSymbol
  }

  const toggleExpand = () => {
    setExpand(!expand);
  };
  useEffect(() => {
    if (symbolFound()) {
      expandItem()
    }
  });
  const expandItem = () => {
    setExpand(true)
  }

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

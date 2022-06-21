import { createTheme } from "@mui/material/styles";
import { grey, indigo } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#97c4eb",
      light: "#c5d1a7",
      dark: "#4e6460",
    },
    secondary: {
      main: indigo[900],
    },
    grey: {
      main: grey[500],
      light: grey[100],
      dark: grey[800],
    },
  },
});

export default theme;

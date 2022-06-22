import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@mui/material/styles";

import "./index.css";
import App from "./App";
import theme from "./utils/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

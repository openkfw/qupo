import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@mui/material/styles";

import "./index.css";
import App from "./App";
import theme from "./utils/theme";
import { NotificationContext } from "./contexts/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <NotificationContext>
        <App />
      </NotificationContext>
    </ThemeProvider>
  </React.StrictMode>
);

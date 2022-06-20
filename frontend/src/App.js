import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import "./App.css";
import ApiClient from "./client";

const client = new ApiClient();

function App() {
  const [symbols, setSymbols] = useState();

  useEffect(() => {
    const fetchSymbols = async () => {
      const s = await client.getSymbols();
      setSymbols(s);
    };

    fetchSymbols();
  });

  console.log(symbols);
  return (
    <Container maxWidth="sm">
      <Typography variant="h3">Portfolio Management</Typography>
    </Container>
  );
}

export default App;

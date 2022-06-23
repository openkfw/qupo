import { useState } from "react";

import Controllers from "../components/Controllers";
import CustomList from "../components/CustomList";

const Stocks = ({ client, setSelectedSymbols }) => {
  const [view, setView] = useState("index");

  return (
    <>
      <Controllers view={view} setView={setView} />
      <CustomList
        view={view}
        client={client}
        setSelectedSymbols={setSelectedSymbols}
      />
    </>
  );
};

export default Stocks;

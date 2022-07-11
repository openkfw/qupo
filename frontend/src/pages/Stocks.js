import { useEffect, useState } from "react";

import Controllers from "../components/Controllers";
import CustomList from "../components/CustomList";
import Search from "../components/Search";

const Stocks = ({ client, setSelectedSymbols }) => {
  const [view, setView] = useState("index");
  const [indices, setIndices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [filter, setFilter] = useState([]);
  const [filterValue, setFilterValue] = useState(null);

  useEffect(() => {
    const fetchIndices = async () => {
      const i = await client.getIndices();
      setIndices(i);
    };

    const fetchCountries = async () => {
      const c = await client.getCountries();
      setCountries(c);
    };

    const fetchIndustries = async () => {
      const i = await client.getIndustries();
      setIndustries(i);
    };

    fetchIndices();
    fetchCountries();
    fetchIndustries();
  }, [client]);

  useEffect(() => {
    setFilterValue(null);
    if (view === "index") setFilter(indices);
    if (view === "country") setFilter(countries);
    if (view === "industry") setFilter(industries);
  }, [view, indices, countries, industries]);

  const filterNames = (names) => {
    return filterValue !== null
      ? names.filter((name) => name === filterValue)
      : names;
  };

  return (
    <>
      <Controllers view={view} setView={setView} />
      <Search
        view={view}
        filter={filter}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      <CustomList
        view={view}
        client={client}
        setSelectedSymbols={setSelectedSymbols}
        indices={filterNames(indices)}
        countries={filterNames(countries)}
        industries={filterNames(industries)}
      />
    </>
  );
};

export default Stocks;

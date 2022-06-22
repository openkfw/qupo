import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { Stack } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import CustomListItem from "./CustomListItem";

const useStyles = makeStyles((theme) => ({
  box: {
    padding: `${theme.spacing(2)} 0`,
  },
}));

const CustomList = ({ client, view, setView }) => {
  const classes = useStyles();
  const [indices, setIndices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);

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

  const fetchSymbolsOfIndex = async (index) => {
    return await client.getIndices(index);
  };

  const fetchSymbolsOfCountry = async (country) => {
    return await client.getCountries(country);
  };

  const fetchSymbolsOfIndustry = async (industry) => {
    return await client.getIndustries(industry);
  };

  return (
    <Box className={classes.box}>
      {view === "index" && (
        <div hidden={!(view === "index")}>
          <Stack spacing={2}>
            {indices.map((index) => (
              <CustomListItem
                key={index}
                fetchSymbols={fetchSymbolsOfIndex}
                kind="Index"
                name={index}
                setView={setView}
              />
            ))}
          </Stack>
        </div>
      )}
      {view === "country" && (
        <div hidden={!(view === "country")}>
          <Stack spacing={2}>
            {countries.map((country) => (
              <CustomListItem
                key={country}
                fetchSymbols={fetchSymbolsOfCountry}
                name={country}
                kind="Country"
                setView={setView}
              />
            ))}
          </Stack>
        </div>
      )}
      {view === "industry" && (
        <div hidden={!(view === "industry")}>
          <Stack spacing={2}>
            {industries.map((industry) => (
              <CustomListItem
                key={industry}
                fetchSymbols={fetchSymbolsOfIndustry}
                name={industry}
                kind="Industry"
                setView={setView}
              />
            ))}
          </Stack>
        </div>
      )}
    </Box>
  );
};

export default CustomList;

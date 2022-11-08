import dayjs from "dayjs";

import { getSymbols } from "../api";

export const shortenString = (word, length) => {
  return word.length > length ? `${word.slice(0, length)}...` : word;
};

export const formatDate = (date) => {
  return dayjs(date, "YYYY-MM-DD").format("DD MMM YYYY");
};
export const filterUniqueSymbols = (symbols) => {
  return [
    ...new Map(symbols.map((symbol) => [symbol["symbol"], symbol])).values(),
  ];
};

export const fetchAllSymbols = async () => {
  const symbols = await getSymbols();
  return filterUniqueSymbols(symbols).sort((a, b) =>
    a.symbol > b.symbol ? 1 : -1
  );
};

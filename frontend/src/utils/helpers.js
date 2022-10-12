import dayjs from "dayjs";

export const shortenString = (word, length) => {
  return word.length > length ? `${word.slice(0, length)}...` : word;
};

export const formatDate = (date) => {
  return dayjs(date, "YYYY-MM-DD").format("DD MMM YYYY");
};

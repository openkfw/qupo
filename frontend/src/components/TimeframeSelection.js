import dayjs from "dayjs";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const TimeframeSelection = ({ timeframe, setTimeframe }) => {
  const options = { mask: "__/__/____", inputFormat: "DD/MM/YYYY" };

  const inputField = (params) => <TextField {...params} />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
        <DatePicker
          label="Start date"
          {...options}
          value={dayjs(timeframe.start)}
          onChange={(newDate) => {
            const isValid = newDate?.isValid();
            if (newDate !== null) {
              setTimeframe({
                ...timeframe,
                start: newDate.format(timeframe.format),
                end: isValid
                  ? newDate.add(1, "month").format(timeframe.format)
                  : timeframe.end,
                isValid: isValid,
              });
            }
          }}
          renderInput={inputField}
        />
        <Box sx={{ p: 2 }}>to</Box>
        <DatePicker
          label="End date"
          {...options}
          value={dayjs(timeframe.end)}
          onChange={(newDate) => {
            const isValid =
              newDate?.isValid() && newDate.isAfter(timeframe.start, "day");
            setTimeframe({
              ...timeframe,
              end: newDate.format(timeframe.format),
              isValid: isValid,
            });
          }}
          shouldDisableDate={(date) => date.isBefore(timeframe.start, "day")}
          renderInput={inputField}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default TimeframeSelection;

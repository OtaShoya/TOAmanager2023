import * as React from "react";
import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

export function DatePickerSample() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ m: 2, width: "25ch" }}>
        <DatePicker />
      </Box>
    </LocalizationProvider>
  );
}

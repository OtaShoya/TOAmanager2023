import * as React from "react";
import TextField from "@mui/material/TextField";

type PropsType = {
  label: string;
  width?: number;
};

const TextBox = ({ label, width = 240 }: PropsType) => {
  return (
    <TextField label={label} variant="outlined" sx={{ width: { width } }} />
  );
};

export default TextBox;

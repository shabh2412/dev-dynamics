import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  options: { label: string; value: string }[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className="w-full">
      <InputLabel id={`custom-select-${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`custom-select-${label}-label`}
        id={`custom-select-${label}`}
        value={value}
        label={label}
        onChange={onChange}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;

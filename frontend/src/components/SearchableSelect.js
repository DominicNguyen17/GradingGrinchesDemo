import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";

const SearchableSelect = ({ options, label, getOptionLabel, renderOption, style, ...otherOptions }) => (
    <Autocomplete
        options={options}
        renderInput={(params) => <TextField {...params} label={label} />}
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
        sx={{ ...style }}
        {...otherOptions}
    />
);

export default SearchableSelect;



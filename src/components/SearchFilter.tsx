import React, { useState } from "react";
import { TextField, MenuItem, Select, InputLabel, FormControl, Box, Button } from "@mui/material";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterOptions?: { label: string; value: string }[];
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
  searchQuery, 
  onSearchChange, 
  filterOptions, 
  selectedFilter, 
  onFilterChange 
}) => {
  return (
    <Box display="flex" gap={2} alignItems="center" mb={2}>
      {/* 🔎 Search Bar */}
      <TextField
        label="Search..."
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flex: 1 }}
      />

      {/* 🔽 Filter Dropdown (Optional) */}
      {filterOptions && onFilterChange && (
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={selectedFilter || ""}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {filterOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* 🔄 Clear Button */}
      <Button variant="outlined" color="secondary" onClick={() => {
        onSearchChange("");
        if (onFilterChange) onFilterChange("");
      }}>
        Clear
      </Button>
    </Box>
  );
};

export default SearchFilter;

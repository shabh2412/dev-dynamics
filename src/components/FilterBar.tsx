import React, { FC } from "react";
import { DataResponse } from "../services/api";
import { SelectChangeEvent } from "@mui/material";
import CustomSelect from "./common/CustomSelect";

interface FilterBarProps {
  filters: {
    dateRange: { start: string; end: string };
    activityType: string;
    user: string;
  };
  data: DataResponse;
  setFilters: (filters: FilterBarProps["filters"]) => void;
}

const FilterBar: FC<FilterBarProps> = ({ filters, setFilters, data }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      dateRange: { ...filters.dateRange, [e.target.name]: e.target.value },
    });
  };

  const handleUserChange = (event: SelectChangeEvent) => {
    setFilters({ ...filters, user: event.target.value });
  };

  const userOptions = data.data.AuthorWorklog.rows.map((row) => ({
    label: row.name,
    value: row.name,
  }));

  return (
    <div className="filter-bar p-4 bg-gray-100 rounded-lg mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label>Date Range Start:</label>
          <input
            type="date"
            name="start"
            value={filters.dateRange.start}
            max={filters.dateRange.end}
            onChange={handleDateChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Date Range End:</label>
          <input
            type="date"
            name="end"
            value={filters.dateRange.end}
            min={filters.dateRange.start}
            onChange={handleDateChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex items-center justify-center h-full">
          {/** vertically center in the container */}
          <CustomSelect
            label="User"
            value={filters.user}
            onChange={handleUserChange}
            options={userOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

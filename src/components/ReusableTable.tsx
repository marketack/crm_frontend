import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  TablePagination,
  IconButton,
  Box,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { MoreVert as MoreVertIcon, UploadFile, Download } from "@mui/icons-material";

interface TableColumn<T = any> {
  id: keyof T;
  label: string;
  numeric?: boolean;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface TableAction<T> {
  icon: React.ReactNode;
  tooltip?: string;
  onClick: (row: T) => void;
}

interface ReusableTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  title?: string;
  actions?: TableAction<T>[];
  selectable?: boolean;
  searchPlaceholder?: string;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  onAddNew?: () => void; // Add this line
}

const ReusableTable = <T extends Record<string, any>>({
  columns,
  data,
  title = "Table",
  actions = [],
  selectable = true,
  searchPlaceholder = "Search...",
  setData,
}: ReusableTableProps<T>) => {
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<T>>(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // **Sorting Logic**
  const handleSort = useCallback((columnId: keyof T) => {
    setOrder((prevOrder) => (orderBy === columnId && prevOrder === "asc" ? "desc" : "asc"));
    setOrderBy(columnId);
  }, [orderBy]);

  const sortedData = [...data].sort((a, b) => {
    if (!orderBy) return 0;
    const valueA = a[orderBy];
    const valueB = b[orderBy];

    if (valueA < valueB) return order === "asc" ? -1 : 1;
    if (valueA > valueB) return order === "asc" ? 1 : -1;
    return 0;
  });

  // **Filtering**
  const filteredData = sortedData.filter((row) =>
    columns.some((col) => row[col.id]?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // **Pagination**
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // **Row Selection**
  const handleSelectRow = useCallback((row: T) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelection = new Set(prevSelectedRows);
      newSelection.has(row) ? newSelection.delete(row) : newSelection.add(row);
      return newSelection;
    });
  }, []);

  const handleSelectAllRows = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedRows(event.target.checked ? new Set(filteredData) : new Set());
    },
    [filteredData]
  );

  // 📤 Export Table Data as CSV
  const handleExport = () => {
    const csvContent = [
      columns.map((col) => col.label).join(","), // Headers
      ...data.map((row) => columns.map((col) => row[col.id]).join(",")), // Data
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 📥 Import Data from CSV
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split("\n").map((row) => row.split(","));

      if (rows.length < 2) return; // Ensure valid data

      const importedData = rows.slice(1).map((row) => {
        const obj: any = {};
        columns.forEach((col, i) => {
          obj[col.id] = row[i] || "";
        });
        return obj;
      });

      setData((prevData) => [...prevData, ...importedData]);
    };
    reader.readAsText(file);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{title}</Typography>

        {/* 📤 Export & 📥 Import Buttons */}
        <Box>
          <Button onClick={handleExport} variant="contained" color="primary" startIcon={<Download />} sx={{ marginRight: 1 }}>
            Export
          </Button>
          <Button component="label" variant="contained" color="secondary" startIcon={<UploadFile />}>
            Import
            <input type="file" accept=".csv" hidden onChange={handleImport} />
          </Button>
        </Box>
      </Box>

      {/* Search Input */}
      <TextField
        fullWidth
        placeholder={searchPlaceholder}
        variant="outlined"
        size="small"
        sx={{ marginBottom: 2 }}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.size > 0 && selectedRows.size < filteredData.length}
                    checked={selectedRows.size === filteredData.length}
                    onChange={handleSelectAllRows}
                  />
                </TableCell>
              )}

              {columns.map((column) => (
                <TableCell key={column.id.toString()} align={column.numeric ? "right" : "left"}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}

              {actions.length > 0 && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedRows.has(row)} onChange={() => handleSelectRow(row)} />
                  </TableCell>
                )}

                {columns.map((column) => (
                  <TableCell key={column.id.toString()} align={column.numeric ? "right" : "left"}>
                    {column.render ? column.render(row) : row[column.id] ?? "N/A"}
                  </TableCell>
                ))}

                {actions.length > 0 && (
                  <TableCell align="right">
                    {actions.map((action, actionIndex) => (
                      <IconButton key={actionIndex} onClick={() => action.onClick(row)} title={action.tooltip}>
                        {action.icon}
                      </IconButton>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReusableTable;

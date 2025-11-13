"use client";
import React from "react";
import {
  Stack,
  Pagination,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FirstPage, LastPage } from "@mui/icons-material";

export default function FooterPagination({
  page,
  setPage,
  limit,
  handleLimit,
  totalPages = 1,
  totalDocs = 0,
}) {
  const handlePageChange = (_, value) => {
    setPage(Number(value));
  };

  const handleFirst = () => page > 1 && setPage(1);
  const handleLast = () => page < totalPages && setPage(totalPages);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {/* First Page Button */}
      <Tooltip title="First Page" arrow>
        <span>
          <IconButton size="small" onClick={handleFirst} disabled={page === 1}>
            <FirstPage fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Pagination */}
      <Pagination
        page={Number(page) || 1}
        count={Number(totalPages) || 1}
        onChange={handlePageChange}
        color="primary"
        size="small"
        siblingCount={1}
        boundaryCount={1}
        shape="rounded"
        showFirstButton={false}
        showLastButton={false}
      />

      {/* Last Page Button */}
      <Tooltip title="Last Page" arrow>
        <span>
          <IconButton
            size="small"
            onClick={handleLast}
            disabled={page === totalPages}
          >
            <LastPage fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Rows per page selector */}
      <Select
        size="small"
        value={limit}
        onChange={(e) => handleLimit(e)}
        sx={{ minWidth: 70 }}
      >
        {[5, 10, 20].map((num) => (
          <MenuItem key={num} value={num}>
            {num}/Page
          </MenuItem>
        ))}
        {totalDocs > 0 && (
          <MenuItem value={totalDocs}>
            All
          </MenuItem>
        )}
      </Select>
    </Stack>
  );
}

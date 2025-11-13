import React, { useState } from "react";
import {
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Stack,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { GET_ORDER_WITH_PAGINATION } from "../schema/Order";
import FooterPagination from "../components/include/FooterPagination";
import EmptyData from "../components/include/EmptyData";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function Items() {
  return (
    <>
      <Box direction="column" justifyContent="start" spacing={2}>
        <IconButton>
          <ArrowBackIosIcon size="25px" color="#0e0d0dff" /> Back
        </IconButton>
      </Box>
      {/* Table */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{ bgcolor: "#f9fafb", "& th": { fontWeight: 600 } }}
              >
                <TableCell>No</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
              </TableRow>
            </TableHead>

            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : isEmpty ? (
              <EmptyData colSpan={5} />
            ) : (
              <TableBody>
                {orderRows.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#f5f9f6" },
                      transition: "0.2s",
                    }}
                  >
                    <TableCell>
                      {index + 1 + (paginationData?.slNo ?? 0)}
                    </TableCell>
                    <TableCell>{formatOrderId(row.userId)}</TableCell>
                    <TableCell align="center">
                      {row.items?.length || 0}
                    </TableCell>
                    <TableCell align="center">{row.totalPrice}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">{row.createdAt}</TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleOpenDrawer(row)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleSnackbar("Delete action clicked")
                            }
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}

export default Items;

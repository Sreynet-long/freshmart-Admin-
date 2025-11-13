"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Stack,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Drawer,
  Button,
  useMediaQuery,
} from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { Add as AddIcon } from "@mui/icons-material";
import { useQuery } from "@apollo/client/react";
import debounce from "lodash.debounce";

import FooterPagination from "../components/include/FooterPagination";
import EmptyData from "../components/include/EmptyData";
import CustomerAction from "../components/Customer/CustomerAction";
import CustomerDetail from "../components/Customer/CustomerDetail";
import CreateCustomer from "../components/Customer/CreateCustomer";
import { GET_USER_WITH_PAGINATION } from "../schema/User";

export default function Customers() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [paginationData, setPaginationData] = useState({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch customers with pagination
  const { data, loading, refetch } = useQuery(GET_USER_WITH_PAGINATION, {
    variables: { page, limit, pagination: true, keyword },
    fetchPolicy: "network-only",
  });

  // Filter only customers on frontend (extra safety)
  const users =
    data?.getUserWithPagination?.data.filter((u) => u.role === "Customer") || [];
  const paginator = data?.getUserWithPagination?.paginator;
  

  useEffect(() => {
    if (paginator) setPaginationData(paginator);
  }, [paginator]);

  // Refetch on page, limit, or keyword change
  useEffect(() => {
    refetch({ page, limit, pagination: true, keyword });
  }, [page, limit, keyword, refetch]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((val) => {
      setPage(1);
      refetch({ page: 1, limit, pagination: true, keyword: val });
    }, 500),
    [limit, refetch]
  );

  const handleSearch = (e) => {
    setKeyword(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedUser(null);
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1);
    refetch({ page: 1, limit: newLimit, pagination: true, keyword });
  };

  return (
    <Stack sx={{ p: { xs: 2, md: 4 } }}>
      {/* HEADER */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{ width: 5, height: 28, bgcolor: "success.main", borderRadius: 2 }}
          />
          <Typography variant="h5" fontWeight={700}>
            Customers & Order History
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Create Customer
        </Button>
        <CreateCustomer open={open} setOpen={setOpen} setRefetch={refetch} />
      </Stack>

      {/* SEARCH BAR */}
      <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Search customers..."
            value={keyword}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CiSearch size={22} color="#5f6368" />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#a5c7e9ff", "& th": { fontWeight: 600 } }}>
                <TableCell>N&ordm;</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : users.length === 0 ? (
              <EmptyData colSpan={5} message="No customers found." />
            ) : (
              <TableBody>
                {users.map((user, idx) => (
                  <TableRow
                    key={user.id || idx}
                    hover
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f5f9f6" } }}
                    onClick={() => handleRowClick(user)}
                  >
                    <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <CustomerAction
                        user={user}
                        userId={user?.id}
                        username={user?.username}
                        setRefetch={refetch}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Card>

      {/* PAGINATION */}
      <Stack direction="row" justifyContent="flex-end" mt={3}>
        <FooterPagination
          page={page}
          setPage={setPage}
          limit={limit}
          handleLimit={handleLimitChange}
          totalDocs={paginationData?.totalDocs || 0}
          totalPages={paginationData?.totalPages || 1}
        />
      </Stack>

      {/* DRAWER — CUSTOMER DETAIL */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: isMobile ? "100%" : 450, p: 3 } }}
      >
        {selectedUser && <CustomerDetail user={selectedUser} />}
      </Drawer>
    </Stack>
  );
}

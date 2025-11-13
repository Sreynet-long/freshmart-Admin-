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
  Button,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { Add as AddIcon } from "@mui/icons-material";
import { useQuery } from "@apollo/client/react";
import debounce from "lodash.debounce";
import FooterPagination from "../components/include/FooterPagination";
import EmptyData from "../components/include/EmptyData";
import { GET_ADMINS } from "../schema/User";
import AdminAction from "../components/Admin/AdminAction";
import CreateAdmin from "../components/Admin/CreateAdmin";

export default function SettingsAdmin() {
  const [openCreate, setOpenCreate] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [paginationData, setPaginationData] = useState({});
  const isMobile = useMediaQuery("(max-width:600px)");

  const { data, loading, refetch } = useQuery(GET_ADMINS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getAdmins) {
      const filtered = data.getAdmins.filter((admin) =>
        admin.username.toLowerCase().includes(keyword.toLowerCase())
      );
      setAdmins(filtered);
    }
    setLoadingState(loading);
  }, [data, loading, keyword]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((val) => {
      setKeyword(val);
    }, 300),
    []
  );

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  // Pagination
  const totalPages = Math.ceil(admins.length / limit);
  const paginatedAdmins = admins.slice((page - 1) * limit, page * limit);

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
            Admins Management
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Create Admin
        </Button>

        <CreateAdmin open={openCreate} setOpen={setOpenCreate} setRefetch={refetch} />
      </Stack>

      {/* SEARCH BAR */}
      <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Search admins..."
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
              <TableRow
                sx={{
                  bgcolor: "#a5c7e9ff",
                  "& th": { fontWeight: 600 },
                }}
              >
                <TableCell>No</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            {loadingState ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : paginatedAdmins.length === 0 ? (
              <EmptyData colSpan={5} message="No admins found." />
            ) : (
              <TableBody>
                {paginatedAdmins.map((admin, idx) => (
                  <TableRow
                    key={admin.id || idx}
                    hover
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f5f9f6" } }}
                  >
                    <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                    <TableCell>{admin.username}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.phoneNumber}</TableCell>
                    <TableCell align="center">
                      <AdminAction admin={admin} refetch={refetch} />
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
          handleLimit={(e) => setLimit(Number(e.target.value))}
          totalDocs={admins.length}
          totalPages={totalPages || 1}
        />
      </Stack>
    </Stack>
  );
}

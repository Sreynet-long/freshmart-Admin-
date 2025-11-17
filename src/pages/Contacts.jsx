"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Stack,
  Button,
  Box,
  TextField,
  Typography,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { Send, Visibility } from "@mui/icons-material";
import { Trash } from "iconsax-react";
import { useQuery, useMutation } from "@apollo/client/react";
import debounce from "lodash.debounce";
import dayjs from "dayjs";

import {
  GET_CONTACT_WITH_PAGINATION,
  REPLY_CONTACT,
  DELETE_CONTACT,
} from "../schema/Contact";
import FooterPagination from "../components/include/FooterPagination";
import EmptyData from "../components/include/EmptyData";

export default function Contacts() {
  const [openView, setOpenView] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [subject, setSubject] = useState("");
  const [paginationData, setPaginationData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const subjects = [
    "General Inquiry",
    "Order Issue (Provide Order #)",
    "Partnership Inquiry",
    "Feedback",
  ];

  // Queries & Mutations
  const { data, loading, error, refetch } = useQuery(GET_CONTACT_WITH_PAGINATION, {
    variables: { page, limit, keyword, subject },
    onCompleted: (res) => setPaginationData(res?.getContactWithPagination?.paginator || {}),
    fetchPolicy: "network-only",
  });

  const [replyContact] = useMutation(REPLY_CONTACT);
  const [deleteContact] = useMutation(DELETE_CONTACT);

  const contactRows = data?.getContactWithPagination?.data || [];
  const isEmpty = !loading && contactRows.length === 0;

  // Debounced search/filter
  const debouncedRefetch = useCallback(
    debounce((p, l, k, s) => refetch({ page: p, limit: l, keyword: k, subject: s }), 400),
    [refetch]
  );

  useEffect(() => {
    debouncedRefetch(page, limit, keyword, subject);
  }, [page, limit, keyword, subject, debouncedRefetch]);

  // Handlers
  const handleSearchChange = (e) => {
    setPage(1);
    setKeyword(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setPage(1);
    setSubject(e.target.value);
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1);
    refetch({ page: 1, limit: newLimit, keyword, subject });
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleOpenView = (row) => {
    setSelectedContact(row);
    setReplyText("");
    setOpenView(true);
  };

  const handleCloseView = () => {
    setSelectedContact(null);
    setReplyText("");
    setOpenView(false);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      await replyContact({ variables: { contactId: selectedContact.id, message: replyText } });
      setSnackbar({ open: true, message: "Reply sent successfully!", severity: "success" });
      handleCloseView();
      refetch({ page, limit, keyword, subject });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to send reply", severity: "error" });
    }
  };

  const handleDeleteConfirm = (row) => {
    setSelectedContact(row);
    setDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedContact) return;
    try {
      const { data } = await deleteContact({ variables: { id: selectedContact.id } });
      if (data.deleteContact.isSuccess) {
        setSnackbar({ open: true, message: "Contact deleted successfully!", severity: "success" });
        setDeleteDialog(false);
        setSelectedContact(null);
        refetch({ page, limit, keyword, subject });
      } else {
        setSnackbar({ open: true, message: "Failed to delete: " + data.deleteContact.messageEn, severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Error deleting contact", severity: "error" });
    }
  };

  return (
    <Box className="page-container" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 5, height: 28, bgcolor: "success.main", borderRadius: 2 }} />
          <Typography variant="h5" fontWeight={700}>Contacts</Typography>
        </Stack>
      </Stack>

      {/* Filters */}
      <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search Customer..."
                value={keyword}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CiSearch size={22} color="#2d6e1dff" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Select fullWidth size="small" value={subject} onChange={handleSubjectChange} displayEmpty>
                <MenuItem value=""><em>All Subjects</em></MenuItem>
                {subjects.map((sub) => (<MenuItem key={sub} value={sub}>{sub}</MenuItem>))}
              </Select>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#a5c7e9ff", "& th": { fontWeight: 600 } }}>
                <TableCell>N&ordm;</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Received At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : error ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ color: "red" }}>
                    Error: {error.message}
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : isEmpty ? (
              <EmptyData colSpan={8} />
            ) : (
              <TableBody>
                {contactRows.map((row, index) => (
                  <TableRow key={row.id || index} hover sx={{ "&:hover": { bgcolor: "#f5f9f6" }, transition: "0.2s" }}>
                    <TableCell>{index + 1 + (page - 1) * limit}</TableCell>
                    <TableCell>{row.contactName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.subject}</TableCell>
                    <TableCell>
                      <Chip label={row.status || "New"} color={row.status === "Resolved" ? "success" : "warning"} size="small" />
                    </TableCell>
                    <TableCell>{row?.receivedAt ? dayjs(Number(row.receivedAt)).format("MMM DD, YYYY - hh:mm A") : "N/A"}</TableCell>
                    <TableCell>{row?.updatedAt ? dayjs(Number(row.updatedAt)).format("MMM DD, YYYY - hh:mm A") : "N/A"}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View & Reply" arrow>
                          <IconButton size="small" onClick={() => handleOpenView(row)} color="primary">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton size="small" onClick={() => handleDeleteConfirm(row)}>
                            <Trash size="18" color="#d32f2f" />
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

      {/* Pagination */}
      <Stack direction="row" justifyContent="flex-end" mt={3}>
        <FooterPagination
          page={page}
          limit={limit}
          setPage={handlePageChange}
          handleLimit={handleLimitChange}
          totalDocs={paginationData?.totalDocs}
          totalPages={paginationData?.totalPages}
        />
      </Stack>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle fontWeight={600} color="error.main">Confirm Delete</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedContact?.contactName}</strong>?
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* View & Reply Dialog */}
      <Dialog open={openView} onClose={handleCloseView} fullWidth maxWidth="sm">
        <DialogTitle>View Contact & Reply</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" fontWeight={600}>Name:</Typography>
          <Typography mb={1}>{selectedContact?.contactName}</Typography>
          <Typography variant="subtitle1" fontWeight={600}>Email:</Typography>
          <Typography mb={1}>{selectedContact?.email}</Typography>
          <Typography variant="subtitle1" fontWeight={600}>Subject:</Typography>
          <Typography mb={1}>{selectedContact?.subject}</Typography>
          <Typography variant="subtitle1" fontWeight={600}>Message:</Typography>
          <Typography mb={2}>{selectedContact?.message}</Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Type your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Cancel</Button>
          <Button variant="contained" color="primary" endIcon={<Send />} onClick={handleReplySubmit}>Send Reply</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

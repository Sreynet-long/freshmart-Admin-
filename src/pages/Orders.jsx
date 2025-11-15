"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Stack,
  Button,
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Drawer,
  Snackbar,
  Alert,
  InputAdornment,
  Card,
  CardContent,
  useMediaQuery,
  Grid,
  Chip,
  MenuItem,
  Select,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { Add as AddIcon, Save as SaveIcon } from "@mui/icons-material";
import { useQuery, useMutation } from "@apollo/client/react";
import debounce from "lodash.debounce";
import dayjs from "dayjs";
import FooterPagination from "../components/include/FooterPagination";
import EmptyData from "../components/include/EmptyData";
import CreateOrder from "../components/Order/CreateOrder";
import OrderDetail from "../components/Order/OrderDetail";
import { Edit, Trash } from "iconsax-react";
import {
  GET_ORDER_WITH_PAGINATION,
  UPDATE_ORDER_STATUS,
  DELETE_ORDER,
} from "../schema/Order";
import DeleteOrder from "../components/Order/DeleteOrder";

export default function Orders() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerStatus, setDrawerStatus] = useState(""); // ✅ Local drawer status
  const [editableItems, setEditableItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [paginationState, setPaginationState] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");
  const statusOptions = [
    "Pending",
    "Accepted",
    "Processing",
    "Delivered",
    "Completed",
    "Cancelled",
  ];

  // Queries
  const { data, loading, refetch } = useQuery(GET_ORDER_WITH_PAGINATION, {
    variables: { page, limit, pagination: true, keyword, status: "" },
    fetchPolicy: "network-only",
    onCompleted: ({ getOrdersWithPagination }) => {
      setPaginationState(getOrdersWithPagination?.paginator || {});
    },
  });

  const orderRows = data?.getOrdersWithPagination?.data || [];
  const paginationData = data?.getOrdersWithPagination?.paginator || {};
  const isEmpty = !loading && orderRows.length === 0;

  // Mutations
  const [updateOrderStatus, { loading: statusLoading }] = useMutation(
    UPDATE_ORDER_STATUS,
    {
      onCompleted: ({ updateOrderStatus }) => {
        if (updateOrderStatus?.isSuccess) {
          showSnackbar(updateOrderStatus.messageEn || "Status updated");
          refetch();
        } else {
          showSnackbar(updateOrderStatus.messageEn || "Update failed", "error");
        }
      },
      onError: (error) =>
        showSnackbar(error.message || "Something went wrong", "error"),
    }
  );

  const [deleteOrderMutation] = useMutation(DELETE_ORDER, {
    onCompleted: (res) => {
      setDeleteLoading(false);
      showSnackbar(res.deleteOrder?.messageEn || "Order deleted");
      refetch();
      handleCloseDeleteDialog();
    },
    onError: (err) => {
      setDeleteLoading(false);
      showSnackbar(err.message || "Delete failed", "error");
    },
  });

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      refetch({ page: 1, limit, pagination: true, keyword: value });
    }, 500),
    [limit, refetch]
  );

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1);
    refetch({ page: 1, limit: newLimit, pagination: true, keyword });
  };

  useEffect(() => {
    refetch({ page, limit, pagination: true, keyword, status });
  }, [page, limit, keyword, status, refetch]);

  // Drawer open/close
  const handleOpenDrawer = (order = null) => {
    setSelectedOrder(order);
    setDrawerStatus(order?.status || "");
    setEditableItems(order?.items?.map((i) => ({ ...i })) || []);
    setOpenDrawer(true);
  };
  const handleCloseDrawer = () => {
    setSelectedOrder(null);
    setDrawerStatus("");
    setEditableItems([]);
    setOpenDrawer(false);
  };

  // Snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedOrder) return;

    setDrawerStatus(newStatus);

    updateOrderStatus({
      variables: {
        id: selectedOrder._id || selectedOrder.id,
        status: newStatus,
      },
    });
  };

  const handleQuantityChange = (index, newQty) => {
    setEditableItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: newQty, price: item.product.price * newQty }
          : item
      )
    );
  };

  const totalPrice = editableItems.reduce((sum, item) => sum + item.price, 0);

  const handleSaveChanges = () => {
    showSnackbar("Order items updated successfully!");
    refetch();
    handleCloseDrawer();
  };

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "accepted":
        return "info";
      case "processing":
        return "primary";
      case "delivered":
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getUserDisplay = (user, userId) =>
    user?.username || user?.email || userId;
  const formatOrderId = (id) =>
    id ? `#UID-${id.slice(-6).toUpperCase()}` : "N/A";

  // Delete Dialog Handlers
  const openDeleteDialog = (order, e) => {
    e.stopPropagation();
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!orderToDelete) return;
    const orderId = orderToDelete._id || orderToDelete.id;
    if (!orderId) return showSnackbar("Invalid order ID", "error");

    setDeleteLoading(true);
    deleteOrderMutation({ variables: { _id: orderId } });
  };

  return (
    <Stack direction="column" sx={{ p: { xs: 2, md: 4 } }} spacing={3}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 5,
              height: 28,
              bgcolor: "success.main",
              borderRadius: 2,
            }}
          />
          <Typography variant="h5" fontWeight={700}>
            Orders
          </Typography>
        </Stack>
      </Stack>

      {/* Search & Filter */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search orders..."
                value={keyword}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CiSearch size={22} color="#5f6368" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Select
                fullWidth
                size="small"
                value={status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setPage(1);
                  setStatus(newStatus);
                  refetch({
                    page: 1,
                    limit,
                    pagination: true,
                    keyword,
                    status: newStatus,
                  });
                }}
                displayEmpty
              >
                <MenuItem value="">
                  <em>All Status</em>
                </MenuItem>
                {statusOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{ bgcolor: "#a5c7e9ff", "& th": { fontWeight: 600 } }}
              >
                <TableCell>N&ordm;</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell align="left">Customer Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="center">Created At</TableCell>
                <TableCell align="center">Total Price</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : isEmpty ? (
              <EmptyData colSpan={7} message="No orders found." />
            ) : (
              <TableBody>
                {orderRows.map((row, index) => (
                  <TableRow
                    key={row.id || row._id || index}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#f5f9f6", cursor: "pointer" },
                    }}
                    onClick={() => handleOpenDrawer(row)}
                  >
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>
                      {row.id
                        ? `#FM-${row.id.slice(-6).toUpperCase()}`
                        : `#FM-${row._id?.slice(-6).toUpperCase()}`}
                    </TableCell>
                    <TableCell align="left">
                      {row?.shippingInfo?.name}
                    </TableCell>
                    <TableCell align="left">
                      {row?.shippingInfo?.email}
                    </TableCell>
                    <TableCell align="center">
                      {row.createdAt
                        ? dayjs(Number(row.createdAt)).format(
                            "MMM DD, YYYY - hh:mm A"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      ${Number(row.totalPrice || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.status}
                        color={statusColor(row.status)}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawer(row);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={(e) => openDeleteDialog(row, e)}
                        >
                          <Trash size={18} color="#d32f2f" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Card>

      {/* Pagination */}
      <Stack direction="row" justifyContent="flex-end">
        <FooterPagination
          page={page}
          limit={limit}
          setPage={setPage}
          handleLimit={handleLimitChange}
          totalDocs={paginationData?.totalDocs || 0}
          totalPages={paginationData?.totalPages || 1}
        />
      </Stack>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: isMobile ? "100%" : 480, p: 2, overflowY: "auto" },
        }}
      >
        {selectedOrder ? (
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              Order Details
            </Typography>
            <Divider />
            <Typography>
              User ID:{" "}
              {getUserDisplay(
                selectedOrder.user,
                formatOrderId(selectedOrder?.userId || selectedOrder?._id)
              )}
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Typography fontWeight={600}>Shipping Information:</Typography>
              <Typography variant="body2">
                <strong>Name:</strong>{" "}
                {selectedOrder?.shippingInfo?.name || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Phone:</strong>{" "}
                {selectedOrder?.shippingInfo?.phone || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong>{" "}
                {selectedOrder?.shippingInfo?.email || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Address:</strong>{" "}
                {selectedOrder?.shippingInfo?.address || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Country:</strong>{" "}
                {selectedOrder?.shippingInfo?.country || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography fontWeight={600}>Payment Information:</Typography>
              <Typography variant="body2">
                <strong>Method:</strong> {selectedOrder?.paymentMethod || "N/A"}
              </Typography>
              {selectedOrder?.paymentProof && (
                <Typography variant="body2">
                  <strong>Payment Proof:</strong>{" "}
                  <a
                    href={selectedOrder.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1976d2", textDecoration: "underline" }}
                  >
                    View Proof
                  </a>
                </Typography>
              )}
            </Box>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Status:</Typography>
              <Select
                size="small"
                value={drawerStatus} // ✅ use local drawer status
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setDrawerStatus(newStatus); // update UI immediately
                  handleStatusChange(newStatus); // update backend
                }}
                disabled={statusLoading}
              >
                {statusOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            <Divider />
            <Typography fontWeight={600}>Items:</Typography>
            <OrderDetail
              items={editableItems}
              onQuantityChange={handleQuantityChange}
            />

            <Divider />
            <Typography fontWeight={700}>
              Total: ${totalPrice.toFixed(2)}
            </Typography>

            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </Stack>
        ) : (
          <CreateOrder onClose={handleCloseDrawer} refetch={refetch} />
        )}
      </Drawer>

      {/* Delete Order Dialog */}
      <DeleteOrder
        open={deleteDialogOpen}
        title="Delete Order"
        message={`Are you sure you want to delete order`}
        confirmText={
          orderToDelete
            ? formatOrderId(orderToDelete._id || orderToDelete.id)
            : ""
        }
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Stack>
  );
}

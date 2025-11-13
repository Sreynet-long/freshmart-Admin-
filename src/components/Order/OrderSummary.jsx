import React from 'react'
import { Drawer, Typography, Stack, Divider, Box, Select, Button } from '@mui/material';
import EditOrder from "../components/Order/EditOrder";
import {
  GET_ORDER_WITH_PAGINATION,
  UPDATE_ORDER_STATUS,
} from "../schema/Order";
const formatOrderId = (id) => `#FM-${id.slice(-6).toUpperCase()}`; 
import CreateOrder from "../components/Order/CreateOrder"; 
import { Add as AddIcon, Save as SaveIcon } from "@mui/icons-material";
import { useQuery, useMutation } from "@apollo/client/react";

function OrderSummary() {
    const formatOrderId = (id) => `#FM-${id.slice(-6).toUpperCase()}`;
    const [openDrawer, setOpenDrawer] = useState(false); 
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editableItems, setEditableItems] = useState([]); 
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    }); 
    const { data, loading, refetch } = useQuery(GET_ORDER_WITH_PAGINATION, {
        variables: { page, limit, pagination: true, keyword },
        fetchPolicy: "network-only",
        onCompleted: ({ getOrdersWithPagination }) => {
          setPaginationData(getOrdersWithPagination?.paginator || {});
        },
    }); 

    const [updateOrderStatus, { loading: statusLoading }] = useMutation(
        UPDATE_ORDER_STATUS,
        {
          onCompleted: ({ updateOrderStatus }) => {
            if (updateOrderStatus?.isSuccess) {
              showSnackbar(updateOrderStatus.messageEn || "Status updated");
              // ✅ instantly update local state for UX
              setSelectedOrder((prev) =>
                prev
                  ? { ...prev, status: updateOrderStatus.newStatus || prev.status }
                  : prev
              );
              refetch();
            } else {
              showSnackbar(updateOrderStatus.messageEn || "Update failed", "error");
            }
          },
          onError: (error) =>
            showSnackbar(error.message || "Something went wrong", "error"),
        }
      ); 

        const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedOrder) return;
    updateOrderStatus({
      variables: {
        id: selectedOrder.id || selectedOrder._id, // ✅ safer handling
        status: newStatus,
      },
    });
  };

 const handleCloseDrawer = () => {
    setSelectedOrder(null);
    setEditableItems([]);
    setOpenDrawer(false);
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

   const getUserDisplay = (user, userId) =>
    user?.username || user?.email || userId;

   const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "canceled":
        return "error";
      default:
        return "default";
    }
  };
  return (
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
            {/* Shipping Information */}
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

            {/* Payment Information */}
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
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(e.target.value)}
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
            <EditOrder
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
          <CreateOrder />
        )}
      </Drawer>
  )
}

export default OrderSummary
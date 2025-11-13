import { useState } from "react";
import { Stack, Card, Typography, Divider, Box, Button } from "@mui/material";
import dayjs from "dayjs";

export default function CustomerOrderList({ orders, refetch }) {
  const [updating, setUpdating] = useState(false);

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setUpdating(true);
    // Replace with actual mutation
    setTimeout(() => {
      console.log("Deleted", orderId);
      setUpdating(false);
      refetch();
    }, 1000);
  };

  if (orders.length === 0)
    return <Typography color="text.secondary">No orders yet.</Typography>;

  return (
    <Stack spacing={2}>
      {orders.map((order, idx) => (
        <Card
          key={order.id || order._id}
          variant="outlined"
          sx={{ p: 2, borderRadius: 2 }}
        >
          {/* Order Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Order #{idx + 1} — {order.status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: ${Number(order.totalPrice || 0).toFixed(2)}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Created:{" "}
            {dayjs(Number(order.createdAt)).format("MMM DD, YYYY - hh:mm A")}
          </Typography>

          <Divider sx={{ my: 1 }} />

          {/* Order Items */}
          {order.items.map((item, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="center">
              <Box
                component="img"
                src={item.product?.imageUrl || "/no-image.png"}
                alt={item.product?.productName}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  objectFit: "cover",
                }}
              />
              <Stack spacing={0}>
                <Typography variant="body2" fontWeight={500}>
                  {item.product?.productName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Qty: {item.quantity} * ${item.product?.price}
                </Typography>
              </Stack>
            </Stack>
          ))}

          {/* Actions */}
          <Stack direction="row" spacing={1} mt={1.5}>
            {/* <Button
              size="small"
              variant="text"
              onClick={() => console.log("View order", order.id)}
              disabled={updating}
            >
              View
            </Button> */}
            <Button
              size="small"
              variant="text"
              color="error"
              onClick={() => handleDelete(order.id)}
              disabled={updating}
            >
              Delete
            </Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

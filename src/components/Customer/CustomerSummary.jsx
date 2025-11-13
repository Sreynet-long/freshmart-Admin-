// components/Customer/CustomerSummary.jsx
import { Card, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

export default function CustomerSummary({ orders }) {
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const lastOrder = orders[0];

  return (
    <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Summary
      </Typography>
      <Stack direction="row" justifyContent="space-between">
        <Typography>Total Orders: {totalOrders}</Typography>
        <Typography>Total Spent: ${totalSpent.toFixed(2)}</Typography>
      </Stack>
      <Typography>
        Last Order:{" "}
        {lastOrder
          ? dayjs(Number(lastOrder.createdAt)).format("MMM DD, YYYY")
          : "—"}
      </Typography>
    </Card>
  );
}

// components/Customer/CustomerDetail.jsx
import { Stack, Typography, CircularProgress, Divider } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { GET_ORDER_BY_USER } from "../../schema/Order";
import CustomerInfo from "./CustomerInfo";
import CustomerSummary from "./CustomerSummary";
import CustomerOrderList from "./CustomerOrderList";

export default function CustomerDetail({ user }) {
  const { data, loading, refetch } = useQuery(GET_ORDER_BY_USER, {
    variables: { userId: user.id },
    fetchPolicy: "network-only",
  });

  const orders = data?.getOrders || [];

  return (
    <Stack spacing={2} sx={{ pb: 4 }}>  
      <Typography variant="h6" fontWeight={700}>
        Customer Detail & Order History
      </Typography>

      {/* Basic info */}
      <CustomerInfo user={user} />

      {/* Summary */}
      <CustomerSummary orders={orders} />

      <Divider sx={{ my: 1 }} />

      {/* Orders */}
      <Typography variant="h6" fontWeight={700}>
        Orders
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <CustomerOrderList orders={orders} refetch={refetch} />
      )}
    </Stack>
  );
}

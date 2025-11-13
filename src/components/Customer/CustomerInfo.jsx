// components/Customer/CustomerInfo.jsx
import { Card, Typography } from "@mui/material";

export default function CustomerInfo({ user }) {
  return (
    <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Basic Info
      </Typography>
      <Typography>
        <b>Username:</b> {user.username}
      </Typography>
      <Typography>
        <b>Email:</b> {user.email}
      </Typography>
      <Typography>
        <b>Phone:</b> {user.phoneNumber}
      </Typography>
    </Card>
  );
}

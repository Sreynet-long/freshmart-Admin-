"use client";
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import { green, grey, blue } from "@mui/material/colors";
import { useQuery } from "@apollo/client/react";
import { CSVLink } from "react-csv";
import { GET_REPORT_STATS } from "../schema/Report"; 

export default function Reports() {
   const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const endDate = new Date().toISOString().slice(0, 10);

  const { data, loading, error } = useQuery(GET_REPORT_STATS, {
     variables: { startDate, endDate },
    fetchPolicy: "cache-first",
  });

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress color="success" />
      </Box>
    );

  if (error)
    return (
      <Box p={3}>
        <Alert severity="error">Error fetching report data.</Alert>
      </Box>
    );

  const report = data?.getReportStats || {};

  // Example static calculations
  const monthlyRevenue = report.totalRevenue || 0;
  const annualRevenue = monthlyRevenue * 12;
  const monthlyOrders = report.totalOrders || 0;
  const annualOrders = monthlyOrders * 12;
  const monthlyUsers = report.totalUsers || 0;
  const annualUsers = monthlyUsers * 12;

  const csvHeaders = [
    { label: "Period", key: "period" },
    { label: "Total Revenue", key: "revenue" },
    { label: "Total Orders", key: "orders" },
    { label: "Total Users", key: "users" },
  ];

  const csvData = [
    {
      period: "Monthly",
      revenue: monthlyRevenue,
      orders: monthlyOrders,
      users: monthlyUsers,
    },
    {
      period: "Annual",
      revenue: annualRevenue,
      orders: annualOrders,
      users: annualUsers,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: grey[100], minHeight: "100vh" }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        mb={3}
        spacing={1}
      >
        <Typography variant="h5" fontWeight={700} color={green[800]}>
          📑 Reports
        </Typography>
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename="reports.csv"
          style={{ textDecoration: "none" }}
        >
          <Button variant="contained" color="success">
            Export CSV
          </Button>
        </CSVLink>
      </Stack>

      <Grid container spacing={3}>
        {/* Monthly Report */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={700}
                mb={1}
                color={blue[700]}
              >
                Monthly Report
              </Typography>
              <Typography>
                Revenue: ${monthlyRevenue.toLocaleString()}
              </Typography>
              <Typography>Orders: {monthlyOrders}</Typography>
              <Typography>Users: {monthlyUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Annual Report */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={700}
                mb={1}
                color={green[700]}
              >
                Annual Report
              </Typography>
              <Typography>
                Revenue: ${annualRevenue.toLocaleString()}
              </Typography>
              <Typography>Orders: {annualOrders}</Typography>
              <Typography>Users: {annualUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

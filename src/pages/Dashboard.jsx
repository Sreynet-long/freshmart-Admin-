"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  CircularProgress,
  Chip,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  green,
  grey,
  blue,
  orange,
  purple,
  yellow,
  pink,
  red,
} from "@mui/material/colors";
import {
  MonetizationOn,
  ShoppingBag,
  Group,
  TrendingUp,
  Inventory2,
  AccountCircle,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuery } from "@apollo/client/react";
import { GET_DASHBOARD_STATS } from "../schema/Dashboard";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function Dashboard() {
  // --- Month Selector State ---
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  // --- Calculate Start & End of Month ---
  const startDate = selectedMonth.startOf("month").format("YYYY-MM-DD");
  const endDate = selectedMonth.endOf("month").format("YYYY-MM-DD");
  const formattedMonthYear = selectedMonth.format("MMMM YYYY");

  const { data, loading, error, refetch } = useQuery(GET_DASHBOARD_STATS, {
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
        <Alert severity="error">
          Error fetching dashboard data. Check your GraphQL server.
        </Alert>
      </Box>
    );

  // --- Data Handling ---

  const stats = data?.getDashboardStats ?? {};
  const dailyRevenue = stats.dailyRevenue || [];

  const defaultColors = [
    "#4caf50",
    "#2196f3",
    "#ff9800",
    "#9c27b0",
    "#f44336",
    "#00bcd4",
    "#ffc107",
    "#e91e63",
    "#8bc34a",
    "#3f51b5",
  ];

  const topCategoriesCount = stats.topCategories?.length || 0;
  const COLORS = Array.from(
    { length: topCategoriesCount },
    (_, i) => defaultColors[i % defaultColors.length]
  );

  const getPieRadius = (numCategories) => {
    if (numCategories <= 5) return 90;
    if (numCategories <= 8) return 80;
    if (numCategories <= 12) return 70;
    return 60;
  };
  const outerRadius = getPieRadius(topCategoriesCount);

  const revenueTarget = 6000;
  const revenueProgress = Math.min(
    Math.round((stats.totalSales / revenueTarget) * 100),
    100
  );
  const pendingOrders = Number(stats.allTimePendingOrders || 0);
  const topProduct = stats.topCategories?.[0]?.name || "N/A";

  const averageOrderValue =
    stats.totalOrders > 0
      ? Math.round(stats.totalSales / stats.totalOrders)
      : 0;
  const totalProductsSold = stats.totalOrders
    ? Math.floor(stats.totalOrders * 2.3)
    : 0;
  const activeUsers = stats.totalUsers
    ? Math.floor(stats.totalUsers * 0.85)
    : 0;
  const inactiveUsers = stats.totalUsers - activeUsers;

  // --- Month Change Handler ---
  const handleMonthChange = (newValue) => {
    setSelectedMonth(newValue);
    const start = newValue.startOf("month").format("YYYY-MM-DD");
    const end = newValue.endOf("month").format("YYYY-MM-DD");
    refetch({ startDate: start, endDate: end });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: grey[100], minHeight: "100vh" }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          mb={3}
          spacing={2}
        >
          <Typography variant="h5" fontWeight={700}>
            📊 Admin Dashboard{" "}
            <span style={{ color: green[800] }}> — {formattedMonthYear} </span>
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={`${startDate} — ${endDate}`}
              size="small"
              color="success"
            />
            <DatePicker
              views={["year", "month"]}
              label="Select Month"
              value={selectedMonth}
              onChange={handleMonthChange}
              slotProps={{
                textField: {
                  size: "small",
                  sx: { bgcolor: "#fff", borderRadius: 1, width: 160 },
                },
              }}
            />
          </Stack>
        </Stack>

        {/* Main Summary Cards */}
        <Grid container spacing={3} mt={1}>
          {[
            {
              title: "Total Revenue",
              value: `$${Number(stats.totalSales || 0).toLocaleString()}`,
              icon: <MonetizationOn style={{ color: "#fff" }} />,
              color: green[700],
            },
            {
              title: "Total Orders",
              value: Number(stats.totalOrders || 0).toLocaleString(),
              icon: <ShoppingBag style={{ color: "#fff" }} />,
              color: purple[600],
            },
            {
              title: "Total Users",
              value: Number(stats.totalUsers || 0).toLocaleString(),
              icon: <Group style={{ color: "#fff" }} />,
              color: blue[500],
            },
            {
              title: "Pending Orders (All Time)",
              value: pendingOrders.toLocaleString(),
              // subtitle: `as of ${dayjs().format("MMM D, YYYY")}`,
              icon: <TrendingUp style={{ color: "#fff" }} />,
              color: orange[400],
            },
          ].map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={{
                  width: "230px",
                  height: "110px",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: card.color }}>{card.icon}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {card.title}
                        {card.subtitle && (
                          <Typography variant="caption" color="text.secondary">
                            {card.subtitle}
                          </Typography>
                        )}
                      </Typography>

                      <Typography variant="h6" fontWeight={700}>
                        {card.value}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Mini Stats Cards */}
        <Grid container spacing={3} mt={1}>
          {[
            {
              title: "Avg Order Value",
              value: `$${averageOrderValue.toLocaleString()}`,
              icon: <MonetizationOn style={{ color: "#fff" }} />,
              color: yellow[600],
            },
            {
              title: "Products Sold",
              value: totalProductsSold.toLocaleString(),
              icon: <Inventory2 style={{ color: "#fff" }} />,
              color: pink[600],
            },
            {
              title: "Active Users",
              value: activeUsers.toLocaleString(),
              icon: <AccountCircle style={{ color: "#fff" }} />,
              color: green[500],
            },
            {
              title: "Inactive Users",
              value: inactiveUsers.toLocaleString(),
              icon: <AccountCircle style={{ color: "#fff" }} />,
              color: red[500],
            },
            // {
            //   title: "Current Pending Orders",
            //   value: Number(stats.currentPendingOrders || 0).toLocaleString(),
            //   icon: <Inventory2 style={{ color: "#fff" }} />,
            //   color: red[400],
            // },
          ].map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={{
                  width: "230px",
                  height: "110px",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.25s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: card.color }}>{card.icon}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {card.title}
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {card.value}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, width: "485px" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={1}>
                  <span style={{ color: green[800] }}>
                    {formattedMonthYear}
                  </span>{" "}
                  Revenue Target
                </Typography>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    Revenue:{" "}
                    <strong>${stats.totalSales?.toLocaleString() || 0}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Target: <strong>${revenueTarget.toLocaleString()}</strong>
                  </Typography>
                </Stack>
                <Typography variant="body2" mb={1}>
                  {revenueProgress}% of monthly goal
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={revenueProgress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: "#e8f5e9",
                    "& .MuiLinearProgress-bar": { bgcolor: green[500] },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                width: "485px",
                height: "147px",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  {formattedMonthYear} Top Selling Product
                </Typography>
                <Typography variant="h6" fontWeight={700} color={green[700]}>
                  {topProduct}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Revenue Chart */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                width: "485px",
                height: "389px",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  <span style={{ color: green[800] }}>
                    {formattedMonthYear}
                  </span>{" "}
                  Daily Revenue
                </Typography>
                <Box height={{ xs: 250, md: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="day"
                        label={{
                          // value: "Day",
                          position: "insideBottom",
                          offset: -5,
                        }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickFormatter={(v) => `$${v.toLocaleString()}`}
                        tick={{ fontSize: 12 }}
                        domain={[0, "dataMax + Math.ceil(dataMax*0.1)"]}
                      />
                      <Tooltip
                        formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
                        contentStyle={{
                          borderRadius: 10,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill={green[700]}
                        radius={[6, 6, 0, 0]}
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Categories */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                width: "485px",
                height: "389px",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  <span style={{ color: green[800] }}>
                    {formattedMonthYear}
                  </span>{" "}
                  Top Categories
                </Typography>

                <Box display="flex" justifyContent="center" alignItems="center">
                  <Box sx={{ width: "60%", height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.topCategories || []}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={80}
                          innerRadius={40}
                          paddingAngle={3}
                          label={({ percent }) =>
                            `${(percent * 100).toFixed(1)}%`
                          }
                          labelLine={false}
                        >
                          {(stats.topCategories || []).map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Legend */}
                  <Box ml={3}>
                    {(stats.topCategories || []).map((cat, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={1}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: COLORS[i % COLORS.length],
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {cat.name}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}

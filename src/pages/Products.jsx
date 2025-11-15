"use client";

import React, { useState, useCallback } from "react";
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
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { Add as AddIcon } from "@mui/icons-material";
import { useQuery } from "@apollo/client/react";
import debounce from "lodash.debounce";

import FooterPagination from "../components/include/FooterPagination";
import EmptyData from "../components/include/EmptyData";
import CreateProduct from "../components/Product/CreateProduct";
import ActionProduct from "../components/Product/ActionProduct";
import { GET_PRODUCT_WITH_PAGINATION } from "../schema/Product";

export default function Products() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [paginationData, setPaginationData] = useState({});
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const categories = [
    "Vegetable",
    "Sneack_and_Bread",
    "Fruit",
    "Meats",
    "Milk_and_Diary",
    "Seafood",
    "Drinks",
    "Frozen_Food",
  ];

  // Fetch products with pagination
  const { data, loading, refetch } = useQuery(GET_PRODUCT_WITH_PAGINATION, {
    variables: {
      page,
      limit,
      pagination: true,
      keyword,
      ...(category ? { category } : {}),
    },
    fetchPolicy: "network-only",

    onCompleted: ({ getProductWithPagination }) => {
      const paginator = getProductWithPagination?.paginator || {};
      setPaginationData(paginator);

      // 🔥 Auto-fix if page > totalPages
      if (page > paginator.totalPages && paginator.totalPages > 0) {
        setPage(1);
      }
    },
  });

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((val) => {
      setPage(1);
      refetch({
        page: 1,
        limit,
        pagination: true,
        keyword: val,
        ...(category ? { category } : {}),
      });
    }, 500),
    [limit, category, refetch]
  );

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    setPage(1);
    refetch({
      page: 1,
      limit,
      pagination: true,
      keyword,
      ...(value ? { category: value } : {}),
    });
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1);
    refetch({
      page: 1,
      limit: newLimit,
      pagination: true,
      keyword,
      ...(category ? { category } : {}),
    });
  };

  const productRows = data?.getProductWithPagination?.data || [];
  const isEmpty = !loading && productRows.length === 0;

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
            sx={{
              width: 5,
              height: 28,
              bgcolor: "success.main",
              borderRadius: 2,
            }}
          />
          <Typography variant="h5" fontWeight={700}>
            Products
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Create Product
        </Button>

        <CreateProduct open={open} close={handleClose} setRefetch={refetch} />
      </Stack>

      {/* FILTERS */}
      <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products..."
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
            <Grid item xs={12} sm={6} md={4}>
              <Select
                size="small"
                value={category}
                onChange={handleCategoryChange}
                displayEmpty
                sx={{ width: "240px" }}
              >
                <MenuItem value="">
                  <em>All Categories</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.replaceAll("_", " ")}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{ bgcolor: "#a5c7e9ff", "& th": { fontWeight: 600 } }}
              >
                <TableCell>N&ordm;</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : isEmpty ? (
              <EmptyData colSpan={6} message="No products found." />
            ) : (
              <TableBody>
                {productRows.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#f5f9f6" },
                      transition: "0.2s",
                    }}
                  >
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          src={row?.imageUrl || ""}
                          alt={row?.productName || ""}
                        />
                        <Typography>{row?.productName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.category.replaceAll("_", " ")}</TableCell>
                    <TableCell align="center">
                      ${row?.price ? row.price.toFixed(2) : "0.00"}
                    </TableCell>
                    <TableCell align="center">{row.desc}</TableCell>
                    <TableCell align="center">
                      <ActionProduct
                        product={row}
                        productId={row?.id}
                        productName={row?.productName}
                        setRefetch={refetch}
                        productImageUrl={row?.imageUrl}
                      />
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
          handleLimit={handleLimitChange}
          totalDocs={paginationData?.totalDocs || 0}
          totalPages={paginationData?.totalPages || 1}
        />
      </Stack>
    </Stack>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  IconButton,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_USER_WITH_PAGINATION  } from "../../schema/User";
import { GET_PRODUCT } from "../../schema/Product";
import { CREATE_ORDER } from "../../schema/Order";

export default function CreateOrder({ onClose, refetch }) {
  const [customer, setCustomer] = useState(null);
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch customers and products
  const { data: customersData } = useQuery(GET_USER_WITH_PAGINATION);
  const { data: productsData } = useQuery(GET_PRODUCT);

  const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
    onCompleted: (res) => {
      showSnackbar("Order created successfully!");
      refetch?.();
      onClose();
    },
    onError: (err) => showSnackbar(err.message, "error"),
  });

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    if (key === "product") {
      newItems[index].product = value;
      newItems[index].price = value.price * newItems[index].quantity;
    } else if (key === "quantity") {
      newItems[index].quantity = Number(value);
      newItems[index].price = newItems[index].product.price * newItems[index].quantity;
    }
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { product: null, quantity: 1, price: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  useEffect(() => {
    const sum = items.reduce((acc, item) => acc + (item.price || 0), 0);
    setTotalPrice(sum);
  }, [items]);

  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const handleCreate = () => {
    if (!customer || items.length === 0) return showSnackbar("Please select customer and add items", "error");
    createOrder({
      variables: {
        userId: customer.id,
        shippingInfo: shipping,
        paymentMethod,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      },
    });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Create Order</Typography>

      {/* Customer */}
      <FormControl fullWidth size="small">
        <InputLabel>Customer</InputLabel>
        <Select value={customer?.id || ""} onChange={(e) => setCustomer(customersData.getUsers.find(c => c.id === e.target.value))}>
          {customersData?.getUsers?.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.username || c.email}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Shipping Info */}
      <TextField label="Name" name="name" value={shipping.name} onChange={handleShippingChange} fullWidth size="small" />
      <TextField label="Email" name="email" value={shipping.email} onChange={handleShippingChange} fullWidth size="small" />
      <TextField label="Phone" name="phone" value={shipping.phone} onChange={handleShippingChange} fullWidth size="small" />
      <TextField label="Address" name="address" value={shipping.address} onChange={handleShippingChange} fullWidth size="small" />
      <TextField label="Country" name="country" value={shipping.country} onChange={handleShippingChange} fullWidth size="small" />

      {/* Payment */}
      <FormControl fullWidth size="small">
        <InputLabel>Payment Method</InputLabel>
        <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Card">Card</MenuItem>
          <MenuItem value="Online">Online</MenuItem>
        </Select>
      </FormControl>

      {/* Items */}
      {items.map((item, index) => (
        <Stack key={index} direction="row" spacing={1} alignItems="center">
          <FormControl fullWidth size="small">
            <InputLabel>Product</InputLabel>
            <Select
              value={item.product?.id || ""}
              onChange={(e) => handleItemChange(index, "product", productsData.getProducts.find(p => p.id === e.target.value))}
            >
              {productsData?.getProducts?.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField type="number" label="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} size="small" />
          <Typography>${item.price.toFixed(2)}</Typography>
          <IconButton onClick={() => removeItem(index)} color="error"><DeleteIcon /></IconButton>
        </Stack>
      ))}
      <Button onClick={addItem}>Add Item</Button>

      <Typography fontWeight={700}>Total: ${totalPrice.toFixed(2)}</Typography>

      {/* Actions */}
      <Stack direction="row" spacing={2}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="success" onClick={handleCreate} disabled={loading}>{loading ? "Creating..." : "Create Order"}</Button>
      </Stack>
    </Stack>
  );
}

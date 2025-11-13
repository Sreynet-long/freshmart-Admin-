"use client";

import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  Button,
  Select,
  MenuItem,
  IconButton,
  Divider,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useMutation } from "@apollo/client/react";
import { UPDATE_ORDER_STATUS } from "../../schema/Order";

export default function EditOrder({
  order,
  editableItems,
  onSaveComplete,
  loading: parentLoading,
}) {
  const [items, setItems] = useState(editableItems || []);
  const [status, setStatus] = useState(order?.status || "Pending");
  const [totalPrice, setTotalPrice] = useState(0);
  const [saving, setSaving] = useState(false);

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);

  // Recalculate total price whenever items change
  useEffect(() => {
    const sum = items.reduce((acc, i) => acc + (i.price || 0), 0);
    setTotalPrice(sum);
  }, [items]);

  // Sync with parent props if editableItems change
  useEffect(() => {
    setItems(editableItems || []);
  }, [editableItems]);

  const handleQuantityChange = (index, value) => {
    const qty = Number(value);
    if (qty < 1) return;
    const newItems = [...items];
    newItems[index].quantity = qty;
    newItems[index].price = newItems[index].product.price * qty;
    setItems(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { product: null, quantity: 1, price: 0 }]);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateOrderStatus({
        variables: {
          _id: order._id,
          status,
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        },
      });

      if (onSaveComplete) onSaveComplete(); // notify parent to refetch & close drawer
    } catch (err) {
      console.error("Failed to save order:", err);
      alert("Failed to save order. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">
        Edit Order #{order._id.slice(-6).toUpperCase()}
      </Typography>

      {/* Status */}
      <FormControl fullWidth size="small">
        <InputLabel>Status</InputLabel>
        <Select value={status} onChange={(e) => handleStatusChange(e.target.value)}>
          {["Pending", "Accepted", "Processing", "Delivered", "Completed", "Cancelled"].map(
            (s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      <Divider />

      {/* Items */}
      {items.map((item, idx) => (
        <Stack key={idx} direction="row" spacing={1} alignItems="center">
          <Typography sx={{ flex: 1 }}>
            {item.product?.name || "Select Product"}
          </Typography>
          <TextField
            type="number"
            label="Qty"
            value={item.quantity}
            size="small"
            onChange={(e) => handleQuantityChange(idx, e.target.value)}
            sx={{ width: 80 }}
            inputProps={{ min: 1 }}
          />
          <Typography>${item.price.toFixed(2)}</Typography>
          <IconButton color="error" onClick={() => removeItem(idx)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}

      <Button variant="outlined" onClick={addItem}>
        Add Item
      </Button>

      <Typography fontWeight={700}>Total: ${totalPrice.toFixed(2)}</Typography>

      {/* Actions */}
      <Stack direction="row" spacing={2}>
        <Button onClick={onSaveComplete}>Cancel</Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSave}
          disabled={saving || parentLoading}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>
    </Stack>
  );
}

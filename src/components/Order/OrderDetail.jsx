import React from "react";
import { Stack, Card, Box, Typography, TextField } from "@mui/material";

export default function OrderDetail({ items, onQuantityChange }) {
  const handleChange = (index, value) => {
    const qty = Number(value);
    if (qty < 1) return;
    onQuantityChange(index, qty);
  };

  return (
    <Stack spacing={1}>
      {items.map((item, idx) => (
        <Card key={idx} variant="outlined" sx={{ p: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              component="img"
              src={item?.product?.imageUrl || "/no-image.png"}
              alt={item?.product?.productName}
              sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                objectFit: "cover",
              }}
            />
            <Stack spacing={0.5} flex={1}>
              <Typography fontWeight={600}>
                {item?.product?.productName}
              </Typography>
              <Typography variant="caption">
                Price: ${item?.product?.price}
              </Typography>
              <TextField
                label="Quantity"
                type="number"
                size="small"
                value={item.quantity}
                onChange={(e) => handleChange(idx, e.target.value)}
                inputProps={{ min: 1 }}
                sx={{ width: 100 }}
              />
              <Typography variant="caption" color="text.secondary">
                Total: ${item?.price?.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  Button,
  IconButton,
  Stack,
  TextField,
  Box,
} from "@mui/material";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";

export default function DeleteOrder({
  open,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "",      
  onClose,
  onConfirm,
  loading = false,
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (open) setInputValue("");
  }, [open]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue === confirmText && !loading) {
      onConfirm();
    }
  };

  const isConfirmDisabled = !confirmText || inputValue.trim() !== confirmText.trim() || loading;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 3, p: 2, position: "relative" },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>{title}</Typography>
          <IconButton onClick={onClose} color="error">
            <DoDisturbOnOutlinedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent>
        <Stack spacing={2} alignItems="center">
          <Typography textAlign="center" sx={{ mt: 1 }}>
            {message}
            {confirmText && (
              <Typography component="span" fontWeight={600}> {confirmText}</Typography>
            )}
          </Typography>

          {confirmText && (
            <TextField
              fullWidth
              size="small"
              placeholder={`Type "${confirmText}" to confirm`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          )}

          {/* Buttons */}
          <Box display="flex" gap={1} mt={1} width="100%">
            <Button variant="outlined" fullWidth onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={onConfirm}
              disabled={isConfirmDisabled}
            >
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

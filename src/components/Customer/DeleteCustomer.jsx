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
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { DELETE_USER } from "../../schema/User";
import { useAuth } from "../../Context/AuthContext";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";

export default function DeleteCustomer({
  userId,
  username,
  open,
  close,
  setRefetch,
}) {
  const { setAlert } = useAuth();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setConfirmText("");
  }, [open]);

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: ({ deleteUser }) => {
      setLoading(false);
      if (deleteUser?.isSuccess) {
        setAlert(
          true,
          "success",
          deleteUser.messageEn || "Customer deleted successfully"
        );
        if (typeof setRefetch === "function") setRefetch();
        close();
      } else {
        setAlert(true, "error", deleteUser.messageEn || "Delete failed");
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message || "Something went wrong");
    },
  });

  const handleDelete = () => {
    if (confirmText.trim() !== username?.trim()) {
      setAlert(true, "error", "Please type the username exactly to confirm.");
      return;
    }
    setLoading(true);
    deleteUser({ variables: { _id: userId } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && confirmText.trim() === username?.trim() && !loading) {
      handleDelete();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 3, p: 2, position: "relative" },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Delete Customer
          </Typography>
          <IconButton onClick={close} color="error">
            <DoDisturbOnOutlinedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent>
        <Stack spacing={2} alignItems="center">
          <Typography textAlign="center" sx={{ mt: 1 }}>
            Are you sure you want to delete this Customer:{" "}
            <Typography component="span" fontWeight={600}>
              {username}
            </Typography>
            ?
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Please type the username below to confirm deletion.
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Enter username"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <Box display="flex" gap={1} mt={1} width="100%">
            <Button variant="outlined" fullWidth onClick={close} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleDelete}
              disabled={loading || confirmText.trim() !== username?.trim() || !username}
            >
              {loading ? <CircularProgress size={20} /> : "Delete"}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

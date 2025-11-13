"use client";

import React, { useState, useEffect } from "react";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Edit, Trash } from "iconsax-react";
import { useMutation } from "@apollo/client/react";
import {
  DELETE_USER,
  UPDATE_USER_STATUS,
  UPDATE_USER,
  GET_ADMINS,
} from "../../schema/User";

export default function AdminAction({ admin }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    username: admin.username,
    email: admin.email,
    phoneNumber: admin.phoneNumber,
  });

  // Keep edit form in sync when admin prop changes
  useEffect(() => {
    setEditForm({
      username: admin.username,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
    });
  }, [admin]);

  // Snackbar system
  const [snackbars, setSnackbars] = useState([]);
  const showSnackbar = (message, severity = "success") => {
    const id = Date.now();
    setSnackbars((prev) => [...prev, { id, message, severity }]);
  };
  const handleCloseSnackbar = (id) => {
    setSnackbars((prev) => prev.filter((snack) => snack.id !== id));
  };

  // Mutations
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_ADMINS }],
  });

  const [updateStatus] = useMutation(UPDATE_USER_STATUS, {
    refetchQueries: [{ query: GET_ADMINS }],
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_ADMINS }],
  });

  // Delete handler
  const handleDelete = async () => {
    setLoading(true);
    try {
      const { data } = await deleteUser({ variables: { id: admin.id } });
      if (data?.deleteUser?.isSuccess) {
        showSnackbar("Admin deleted successfully!");
        setOpenConfirm(false);
      } else {
        showSnackbar(data?.deleteUser?.messageEn || "Delete failed.", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Something went wrong while deleting.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Toggle handler (✅ fixed `_id`)
  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      const { data } = await updateStatus({
        variables: { _id: admin.id, checked: !admin.checked },
      });

      if (data?.updateUserStatus?.isSuccess) {
        showSnackbar(`Admin ${!admin.checked ? "activated" : "deactivated"}!`);
      } else {
        showSnackbar("Status update failed.", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Something went wrong while updating status.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Edit handler (✅ fixed `_id`)
  const handleEdit = async () => {
    setLoading(true);
    try {
      const { data } = await updateUser({
        variables: { id: admin.id, input: editForm },
      });
      console.log("Update response:", data);

      if (data?.updateUser?.isSuccess) {
        setOpenEdit(false);
        showSnackbar("Admin updated successfully!");
      } else {
        showSnackbar(data?.updateUser?.messageEn || "Update failed.", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Something went wrong while updating.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle switch */}
      <Tooltip title="Active / Inactive">
        <Switch
          checked={admin.checked || false}
          onChange={handleToggleStatus}
          color="primary"
          disabled={loading}
        />
      </Tooltip>

      {/* Edit button */}
      <Tooltip title="Edit Admin">
        <IconButton
          color="primary"
          onClick={() => setOpenEdit(true)}
          disabled={loading}
        >
          <Edit size="18" color="#1976d2" />
        </IconButton>
      </Tooltip>

      {/* Delete button */}
      <Tooltip title="Delete Admin">
        <IconButton
          color="error"
          onClick={() => setOpenConfirm(true)}
          disabled={loading}
        >
          <Trash size="18" color="#d32f2f" />
        </IconButton>
      </Tooltip>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Are you sure you want to delete this admin?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={editForm.username}
            onChange={(e) =>
              setEditForm({ ...editForm, username: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={editForm.email}
            onChange={(e) =>
              setEditForm({ ...editForm, email: e.target.value })
            }
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={editForm.phoneNumber}
            onChange={(e) =>
              setEditForm({ ...editForm, phoneNumber: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEdit} disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
      <Stack
        spacing={1}
        sx={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
      >
        {snackbars.map((snack) => (
          <Snackbar
            key={snack.id}
            open
            autoHideDuration={3000}
            onClose={() => handleCloseSnackbar(snack.id)}
          >
            <Alert
              onClose={() => handleCloseSnackbar(snack.id)}
              severity={snack.severity}
              sx={{ width: "100%" }}
            >
              {snack.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </>
  );
}

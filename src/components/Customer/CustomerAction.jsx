import React, { useState } from "react";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { Edit, Trash } from "iconsax-react";
import UpdateCustomer from "./UpdateCustomer";
import DeleteCustomer from "./DeleteCustomer";

export default function CustomerAction({ setRefetch, username, user, userId }) {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // ✅ define close handler for delete
  const handleCloseDelete = () => setOpenDelete(false);

  return (
    <>
      {/* Action Buttons */}
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
      >
        <Tooltip title="Update Product">
          <IconButton
            size="small"
            color="primary"
            onClick={() => setOpenUpdate(true)}
            sx={{ "&:hover": { bgcolor: "rgba(25,118,210,0.08)" } }}
          >
            <Edit size="18" color="#1976d2" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Product">
          <IconButton
            size="small"
            color="error"
            onClick={() => setOpenDelete(true)}
            sx={{ "&:hover": { bgcolor: "rgba(211,47,47,0.08)" } }}
          >
            <Trash size="18" color="#d32f2f" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Edit Drawer */}
      {openUpdate && (
        <UpdateCustomer
          open={openUpdate}
          handleClose={() => setOpenUpdate(false)}
          user={user}
          userId={userId}
          setRefetch={setRefetch}
        />
      )}

      {/* ✅ Delete Dialog */}
      {openDelete && (
        <DeleteCustomer
          open={openDelete}
          close={handleCloseDelete}
          username={username}
          userId={userId}
          setRefetch={setRefetch}
        />
      )}
    </>
  );
}

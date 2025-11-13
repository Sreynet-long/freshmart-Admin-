import React, { useState } from "react";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { Edit, Trash } from "iconsax-react";
import UpdateProduct from "./UpdateProduct";
import DeleteProduct from "./DeleteProduct";

export default function ActionProduct({
  product,
  setRefetch,
  productId,
  productImageUrl,
  productName,
}) {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // ✅ define close handler for delete
  const handleCloseDelete = () => setOpenDelete(false);

  if (!product) return null;

  return (
    <>
      {/* Action Buttons */}
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
      >
        <Tooltip title="Edit Product">
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

      {/* ✅ Update Drawer */}
      <UpdateProduct
        open={openUpdate}
        close={() => setOpenUpdate(false)}
        product={product}
        setRefetch={setRefetch}
      />

      {/* ✅ Delete Dialog */}
      {openDelete && (
        <DeleteProduct
          open={openDelete}
          close={handleCloseDelete} // ✅ now defined
          productName={productName}
          productId={productId}
          productImageUrl={productImageUrl}
          setRefetch={setRefetch}
        />
      )}
    </>
  );
}

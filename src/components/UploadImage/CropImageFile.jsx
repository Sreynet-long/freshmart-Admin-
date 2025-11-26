import React, { useState } from "react";
import { Dialog, Box, Button, Stack } from "@mui/material";
import Cropper from "react-easy-crop";
import getCroppedImg from "./Crop"; // your helper function

export default function CropImageFile({
  uploadImage,          // hook's upload function (uploadToServer)
  setProfileHook,       // hook state setter
  setImagePublicId,
  openCrop,
  setOpenCrop,
  photoURL,
  setPhotoURL,
  setImageFile,
  setProgress,
  setStatusProgress,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const cropComplete = (_, croppedPixels) => setCroppedAreaPixels(croppedPixels);

const handleCropAndUpload = async () => {
  if (!croppedAreaPixels) return;

  try {
    setLoading(true);
    const { file, url } = await getCroppedImg(photoURL, croppedAreaPixels, rotation);
    setPhotoURL(url);
    setImageFile(file);
    setOpenCrop(false);

    setStatusProgress(true);
    setProgress(0);

    const { imageUrl, publicId } = await uploadImage(file);

    setProfileHook(imageUrl);
    setImagePublicId(publicId);

    setProgress(100);
    setStatusProgress(false);
  } catch (err) {
    console.error("Upload failed:", err);
    setStatusProgress(false);
    setProgress(0);
  } finally {
    setLoading(false);
  }
};



  return (
    <Dialog open={openCrop} fullWidth maxWidth="sm">
      <Box sx={{ p: 2, height: 400, position: "relative" }}>
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
          onZoomChange={setZoom}
          style={{
            containerStyle: {
              backgroundColor: "#fff", 
            },
          }}
        />
      </Box>
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ p: 2 }}>
        <Button onClick={() => setOpenCrop(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleCropAndUpload} disabled={loading}>
          {loading ? "Processing..." : "Crop & Upload"}
        </Button>
      </Stack>
    </Dialog>
  );
}

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from "@mui/material/DialogTitle";
import imageCompression from "browser-image-compression";
import CropIcon from "@mui/icons-material/Crop";
import Dialog from "@mui/material/Dialog";
import { Cancel } from "@mui/icons-material";
import Cropper from "react-easy-crop";
import { Box, Button, IconButton, Slider, Stack, Typography } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./cropimagefile.scss";
import getCroppedImg from "./Crop";

export default function CropImageFile({
  setProgress,
  setStatusProgress,
  openCrop,
  setOpenCrop,
  photoURL,
  setPhotoURL,
  setImageFile,
  setProfileHook,
}) {
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const newDate = moment(new Date()).format("MMdYYYY");
  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
    try {
      const { file, url } = await getCroppedImg(photoURL, croppedAreaPixels, rotation);
      setLoading(true);
      setTimeout(() => {
        setPhotoURL(url);
        setImageFile(file);
        setOpenCrop(false);
        setStatusProgress(true);
        setProgress(10);
        uploadImage(file);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);
    let newName = `${uuidv4()}${newDate}${file.name.split(".").pop()}`;
    var newFile = new File([compressedFile], `${newName}.png`, {
      type: "image/png",
    });
    setProfileHook(`${process.env.REACT_APP_IMAGE_SERVER}${newName}.png${process.env.REACT_APP_IMAGE_URL}`);
  };

  return (
    <Dialog open={openCrop} fullWidth maxWidth="sm" className="crop-container">
      {/* rest of your dialog code unchanged */}
    </Dialog>
  );
}

const zoomPercent = (value) => `${Math.round(value * 100)}%`;

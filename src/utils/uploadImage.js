// src/utils/uploadImage.js
import axios from "axios"; // or your Cloudinary utility
// or import { v4 as uuidv4 } from "uuid"; if needed

export const uploadImageToServer = async (file) => {
  if (!file) return null;

  // Example Cloudinary POST
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default"); // from Cloudinary
  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dkbjymmoa/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();
  return data.secure_url;
};

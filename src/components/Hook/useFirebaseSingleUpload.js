import { useState } from "react";
import axios from "axios";

export default function useFirebaseSingleUpload() {
  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState(null);
  const [imageLink, setImageLink] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileInputChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const uploadToBackend = async () => {
    if (imageLink) return imageLink;

    if (!file) return "";

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "https://freshmart-backend-b73r.onrender.com/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      }
    );

    return res.data.imageUrl;
  };

  const reset = () => {
    setPreviewUrl("");
    setFile(null);
    setImageLink("");
    setProgress(0);
  };

  return {
    previewUrl,
    file,
    imageLink,
    setImageLink,
    progress,
    handleFileInputChange,
    uploadToBackend,
    reset,
  };
}

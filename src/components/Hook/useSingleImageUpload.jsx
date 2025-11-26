import { useState, useMemo, useCallback, useEffect } from "react";

export default function useSingleImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [openCrop, setOpenCrop] = useState(false);
  const [statusProgress, setStatusProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [profileHook, setProfileHook] = useState(""); // final Cloudinary URL
  const [imageLink, setImageLink] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");

  // Preview URL for local display before upload
  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    if (imageLink) return imageLink;
    return null;
  }, [imageFile, imageLink]);

  // Cleanup object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && imageFile) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, imageFile]);

  // Handle file input change
  const handleFileInputChange = useCallback((e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setPhotoURL(URL.createObjectURL(file));
    setImageFile(file);
    setOpenCrop(true); // open crop dialog
  }, []);

  // Upload via backend (to /upload/single)
const uploadToServer = useCallback(async (file) => {
  if (!file) return null;
  setStatusProgress(true);
  setProgress(0);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:6380/upload/single", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (data.success) {
      const url = data.imageUrl || data.secure_url; // ✅ handle both cases
      setProfileHook(url);
      setImagePublicId(data.public_id);
      setProgress(100);
      return { imageUrl: url, publicId: data.public_id };
    } else {
      throw new Error(data.message || "Upload failed");
    }
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  } finally {
    setStatusProgress(false);
  }
}, []);
  // Reset state
  const reset = useCallback(() => {
    setImageFile(null);
    setPhotoURL(null);
    setOpenCrop(false);
    setStatusProgress(false);
    setProgress(0);
    setProfileHook("");
    setImagePublicId("");
    setImageLink("");
  }, []);

  return {
    imageFile,
    photoURL,
    openCrop,
    statusProgress,
    progress,
    previewUrl,
    profileHook,      // ✅ final Cloudinary URL
    imageLink,
    imagePublicId,
    setImageLink,
    setPhotoURL,
    setImageFile,
    setOpenCrop,
    setProgress,
    setStatusProgress,
    handleFileInputChange,
    uploadToServer,   // ✅ returns string URL
    setProfileHook,
    setImagePublicId,
    reset,
  };
}

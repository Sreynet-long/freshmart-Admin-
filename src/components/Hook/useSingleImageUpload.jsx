import { useCallback, useEffect, useMemo, useState } from "react";
import { useDeleteImageServer } from "../UploadImage/DeleteImageServer";

export default function useSingleImageUpload(options = {}) {
  const { storage = "intern", folder = "sreynet" } = options;
  const mutationDelete = useDeleteImageServer();

  const [profileHook, setProfileHook] = useState(""); // Final URL to submit
  const [imageFile, setImageFile] = useState(null); // File object
  const [photoURL, setPhotoURL] = useState(null); // For cropping preview
  const [openCrop, setOpenCrop] = useState(false);
  const [statusProgress, setStatusProgress] = useState(false);
  const [progress, setProgress] = useState(10);
  const [imageLink, setImageLink] = useState(""); // New: direct URL input

  //=====================IMAGE PREVIEW===================================
  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    if (imageLink) return imageLink; // Use pasted link as preview
    return null;
  }, [imageFile, imageLink]);

  useEffect(() => {
    return () => {
      if (previewUrl && imageFile) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, imageFile]);

  //========================HANDLE FILE CHANGE==========================
  const handleFileInputChange = useCallback((e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setPhotoURL(URL.createObjectURL(file));
      setOpenCrop(true);
    }
  }, []);

  //========================EXTRACT IMAGE NAME FROM SERVER URL===========
  const extractFileNameFromServerUrl = (url) => {
    try {
      const match = url.match(/fileName:([^/]+)/);
      return match?.[1] || null;
    } catch {
      return null;
    }
  };

  //========================DELETE CURRENT IMAGE========================
  const deleteCurrentImage = useCallback(() => {
    if (!profileHook) return;
    const file = extractFileNameFromServerUrl(profileHook);
    if (!file) return;
    mutationDelete.mutate({
      storage,
      folder,
      file,
    });
  }, [folder, mutationDelete, profileHook, storage]);

  //========================RESET HOOK===============================
  const reset = useCallback(() => {
    setProfileHook("");
    setImageFile(null);
    setPhotoURL(null);
    setOpenCrop(false);
    setStatusProgress(false);
    setProgress(10);
    setImageLink("");
  }, []);

  //========================SET FINAL URL===============================
  // Either the uploaded file URL or the pasted link
  const finalProfileHook = useMemo(() => {
    return profileHook || imageLink;
  }, [profileHook, imageLink]);

  return {
    // State
    profileHook: finalProfileHook,
    imageFile,
    photoURL,
    openCrop,
    statusProgress,
    progress,
    previewUrl,
    imageLink,

    // Setters
    setProfileHook,
    setImageFile,
    setPhotoURL,
    setOpenCrop,
    setStatusProgress,
    setProgress,
    setImageLink,

    // Handlers
    handleFileInputChange,
    deleteCurrentImage,
    reset,
  };
}

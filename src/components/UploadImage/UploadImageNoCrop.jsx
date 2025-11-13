import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import GoglobalStoreage from "goglobalstoragenpm";
import moment from "moment";

export const uploadImageToServer = async (file) => {
  let goglobalStoreage = new GoglobalStoreage();
  await goglobalStoreage.createClient(
    "684fccd2872e8a3dd3330ef4",
    "1A1TVysKmA7xFNFpelNs5uqIwSXXLP4zjODwWMqKGhp"
  );

  if (!file) return;

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const newDate = moment(new Date()).format("MMdYYYY");

  const compressedFile = await imageCompression(file, options);
  let newName = `${uuidv4()}${newDate}${file.name.split(".").pop()}`;
  var newFile = new File([compressedFile], `${newName}.png`, {
    type: "image/png",
  });

  goglobalStoreage.upload("sr_music_academy", "sr_music_images", newFile, "");

  return `${process.env.REACT_APP_IMAGE_SERVER}fileName:${newName}.png${process.env.REACT_APP_IMAGE_URL}`;
};

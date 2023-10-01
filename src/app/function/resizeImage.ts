import sharp from "sharp";
import axios from "axios";
import { storeS3Buffer, storeS3File } from "../s3/service";
import path from "path";

export const downloadAndResizeImage = async ({
  url,
  width = 300, // default width to resize
  height, // default height to resize
  workspaceId,
}: {
  url: string;
  width?: number;
  height?: number;
  workspaceId: string;
}) => {
  try {
    const extension = path?.extname(url || "");

    // Download the image from the URL as an array buffer
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // Get the image buffer from the response
    const imageBuffer = Buffer.from(response.data, "binary");

    // Create a sharp object with the image buffer
    const image = sharp(imageBuffer);

    // Obtain the metadata of the image
    const metadata = await image.metadata();

    // Validate the file type to ensure it's an image
    if (!metadata.format) {
      throw new Error("Downloaded file is not an image.");
    }

    // Resize the image to the specified width, maintaining aspect ratio
    const outputBuffer = await image.resize({ width, height }).toBuffer();

    const uploadResult = await storeS3Buffer({
      buffer: outputBuffer,
      filename: url,
      key: "resize",
      workspaceId: workspaceId,
    });

    return uploadResult;
  } catch (error) {
    console.error(error);
  }
};

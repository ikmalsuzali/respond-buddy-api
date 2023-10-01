import sharp from "sharp";
import axios from "axios";
import { storeS3Buffer, storeS3File } from "../s3/service";

export const downloadAndConvertImageFormat = async ({
  url,
  format = "jpeg", // default format to convert
  workspaceId,
}: {
  url: string;
  format?: string;
  workspaceId: string;
}) => {
  try {
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

    // Handle different output formats
    let outputBuffer;
    switch (format) {
      case "heif":
        outputBuffer = await image.heif().toBuffer();
        break;
      case "tiff":
        outputBuffer = await image.tiff().toBuffer();
        break;
      case "jp2":
        outputBuffer = await image.jp2().toBuffer();
        break;
      case "jpg":
        outputBuffer = await image.jpeg().toBuffer();
        break;
      case "jpeg":
        outputBuffer = await image.jpeg().toBuffer();
        break;
      case "png":
        outputBuffer = await image.png().toBuffer();
        break;
      case "webp":
        outputBuffer = await image.webp().toBuffer();
        break;
      default:
        throw new Error(`Unsupported image format: ${format}`);
    }

    const uploadResult = await storeS3Buffer({
      buffer: outputBuffer,
      filename: url,
      key: "convert",
      workspaceId: workspaceId,
    });

    return uploadResult?.url || "Failed to convert image";
  } catch (error) {
    console.error(error);
  }
};

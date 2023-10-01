// @ts-ignore
import sharp from "sharp";
import axios from "axios";
import { storeS3Buffer, storeS3File } from "../s3/service";
import path from "path";
import FileType from "file-type";

export const downloadAndCompressImage = async ({
  url,
  quality = 80,
  workspaceId,
}: {
  url: string;
  quality?: number;
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
    const fileType = await FileType.fromBuffer(imageBuffer);
    // const metadata = await image.metadata();

    // Validate the file type to ensure it's an image
    // if (!metadata.format) {
    //   throw new Error("Downloaded file is not an image.");
    // }

    // Initialize S3 client
    // const s3 = new AWS.S3();

    // Handle different image types
    let outputBuffer;
    switch (fileType?.ext) {
      case "jpg":
        // Compress JPEG image
        outputBuffer = await image.jpeg({ quality }).toBuffer();
        break;
      case "png":
        // Compress PNG image
        outputBuffer = await image.png({ quality }).toBuffer();
        break;
      default:
        throw new Error(`Unsupported image format: ${extension}`);
    }

    const uploadResult = await storeS3Buffer({
      buffer: outputBuffer,
      filename: url,
      key: "compress",
      workspaceId: workspaceId,
    });

    return uploadResult;
  } catch (error) {
    console.log(error);
    return "Failed to compress image, because there was no and/or incorrect image url";
  }
};

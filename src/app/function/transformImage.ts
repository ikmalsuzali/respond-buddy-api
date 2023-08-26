import sharp from "sharp";
import { storeS3File } from "../s3/service";

export const convertImageUrl = async ({
  imageUrl,
  outputDir,
  format,
  size,
  userId,
  workspaceId,
}: {
  imageUrl: string;
  outputDir: string;
  format: string;
  size: {};
  userId?: string;
  workspaceId?: string;
}) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data);
    const image = sharp(imageBuffer);
    let newImage = image;

    if (size) {
      newImage = image.clone().resize(size.width, size.height);
    }

    if (format) {
      newImage = newImage.toFormat(format);
    }

    const outputFileName = `image_${format}_${size.width}x${size.height}.${format}`;

    const uploadResult = storeS3File({
      file: newImage,
      key: outputFileName,
      workspaceId: null,
      userId,
    });

    return uploadResult;
  } catch (error) {
    console.error("Error:", error);
  }
};

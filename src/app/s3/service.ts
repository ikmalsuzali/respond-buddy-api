import path from "path";
import { s3 } from "../../main";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import fs from "fs";
import os from "os";

export const storeS3File = async ({
  file,
  workspaceId,
  key,
}: {
  file: any;
  workspaceId: string;
  key?: string;
}) => {
  try {
    const allowedExtensions = [
      ".csv",
      ".xls",
      ".xlsx",
      ".doc",
      ".docx",
      ".db",
      ".txt",
      ".pdf",
      ".html",
    ];
    console.log(file.filename);

    const extension = path.extname(file.filename);

    if (allowedExtensions.includes(extension)) {
      console.log(file);

      const fileBuffer = Buffer.from(await file.toBuffer(), "base64");
      console.log("🚀 ~ file: service.ts:31 ~ fileBuffer:", fileBuffer);
      const newKey = key || `${workspaceId}_${Date.now()}${extension}`;
      const uploadParams = {
        Bucket: "respondbuddy",
        Key: newKey,
        Body: fileBuffer,
        ACL: "public-read",
      };
      console.log("🚀 ~ file: service.ts:36 ~ uploadParams:", uploadParams);

      const data = await s3.send(new PutObjectCommand(uploadParams));
      console.log("File uploaded successfully:", data);
      return {
        data,
        newKey,
      };
    }
    throw new Error("File type not supported");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const deleteS3File = async ({ key }: { key: string }) => {
  try {
    const deleteParams = {
      Bucket: "YOUR_BUCKET_NAME",
      Key: key,
    };

    // Delete the file from DigitalOcean Spaces
    const deletedResult = await s3.deleteObject(deleteParams).promise();
    return deletedResult;
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export const convertS3UrlToFile = async (s3Url: string) => {
  try {
    const response = await axios.get(s3Url, { responseType: "arraybuffer" });
    return response.data;
  } catch (error) {
    console.error("Error converting S3 URL to file:", error);
    throw error;
  }
};

export const convertS3UrlToTempFile = async (s3Url: string) => {
  try {
    const extension = await getExtensionFromS3File(s3Url);
    const response = await axios.get(s3Url, { responseType: "arraybuffer" });
    const tempFilePath = path.join(
      os.tmpdir(),
      `s3file_${Date.now()}.${extension}}`
    );
    fs.writeFileSync(tempFilePath, response.data);
    return tempFilePath;
  } catch (error) {
    console.error("Error converting S3 URL to temp file:", error);
    throw error;
  }
};

export const getExtensionFromS3File = async (fileKey: string) => {
  // Split the file key by '.' to separate the file name and extension
  const parts = fileKey.split(".");

  // If there are no parts or only one part, there is no extension
  if (parts.length <= 1) {
    return "";
  }

  // The extension is the last part of the split
  const extension = parts[parts.length - 1];

  return extension;
};

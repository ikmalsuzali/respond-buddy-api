const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const secretKey = "jXn2r5u8QfTjWnZr+MbQeThWD(G+KbPU";
const iv = crypto.randomBytes(16);
import axios from "axios";
const { parseString } = require("xml2js");

export const getValidEmails = (str: string | undefined) => {
  if (!str) return [];
  // Break the string into an array of words based on comma
  const emails = str.split(",");
  console.log(emails);
  let validEmailList: string[] = [];

  emails.forEach((email: string) => {
    // Remove any whitespace from the string
    email = email.trim();

    // Check if the email is valid
    if (isValidEmail(email)) {
      validEmailList.push(email);
    }
  });

  return validEmailList;
};

export const nameToKey = (name: string | undefined) => {
  if (!name || typeof name !== "string") {
    return "";
  }

  // Convert to lowercase
  let key = name.toLowerCase();

  // Replace spaces with hyphens
  key = key.replace(/\s+/g, "-");

  // Remove special characters
  key = key.replace(/[^a-z0-9-]/g, "");

  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const randomSuffix = Array.from({ length: 4 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");

  key += `-${randomSuffix}`;

  return key;
};

export const isValidEmail = (str: string | undefined) => {
  if (!str) return false;
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(str);
};

export const decryptJwt = (token: string | undefined) => {
  if (!token)
    return {
      custom_metadata: {
        user_id: "",
        workspace_id: "",
      },
    };
  let tokenJWT = token;
  if (token.includes("Bearer")) {
    tokenJWT = token.split(" ")[1];
  }
  const decodedPayload = jwt.decode(tokenJWT);
  return decodedPayload;
};

export const addMetadataToToken = (
  token: string,
  secret: string,
  additionalMetadata: any
) => {
  // Step 1: Decode the JWT token to extract the payload (without verifying)
  const decodedPayload = jwt.decode(token);

  // Step 2: Add the new metadata to the payload
  const updatedPayload = {
    ...decodedPayload,
    custom_metadata: {
      ...(decodedPayload.custom_metadata || {}),
      ...additionalMetadata,
    },
  };

  console.log(updatedPayload);

  // Step 3: Sign the updated payload and create a new JWT token
  const updatedToken = jwt.sign(updatedPayload, secret);
  return updatedToken;
};

export const validateObject = (object: any, schema: any): string[] => {
  const errors: any[] = [];

  console.log(object, schema);

  for (const key in schema) {
    const propertySchema = schema[key];
    const value = object[key];

    if (
      propertySchema.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push({ [key]: `${key} is required.` });
    }

    if (value !== undefined && typeof value !== propertySchema.type) {
      errors.push({
        [key]: `${key} should be of type ${propertySchema.type}.`,
      });
    }
  }

  return errors;
};

export const encrypt = (text: string): string => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

// Decryption function
export const decrypt = (encryptedText: string) => {
  const parts: string[] = encryptedText.split(":");
  const decipherIv = Buffer.from(parts.shift()!, "hex");
  const decipherText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, decipherIv);
  return decipher.update(decipherText, "hex", "utf8") + decipher.final("utf8");
};

export const isEmail = (text: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(text);
};

export const isPhoneNumber = (text: string) => {
  const phoneNumberRegex = /^\d{10}$/;
  return phoneNumberRegex.test(text);
};

export const isUsernameOrRealName = (value: string) => {
  // Count the number of whitespace characters in the value
  const whitespaceCount = (value.match(/\s/g) || []).length;

  // Check if the value contains more than one whitespace character
  // If it does, it is more likely to be a real name
  if (whitespaceCount > 1) {
    return "real_name";
  }

  // Check if the value contains alphanumeric characters
  // If it does, it is more likely to be a username
  if (/[a-zA-Z0-9]/.test(value)) {
    return "username";
  }

  // If neither condition is met, it is difficult to determine
  return "uncertain";
};

// export const getFileType = async (buffer: any) => {
//   const type = await FileType.fromBuffer(buffer);
//   return type ? type.mime : "unknown";
// };

export const addHttpsToUrl = (url: string) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};

export const addSitemapToUrl = (url: string) => {
  if (!url.endsWith("")) {
    return `https://${url}`;
  }
  return url;
};

export const getWebsiteUrlsFromSitemap = async (url: string) => {
  try {
    let sitemapUrl = addSitemapToUrl(url);
    const response = await axios.get(sitemapUrl);
    const xmlData = response.data;

    const parsedData: any = await parseStringPromise(xmlData);
    const urls = parsedData.urlset.url.map((url: any) => url?.loc[0]);

    return urls;
  } catch (error) {
    throw error;
  }
};

export const addSitemapPathToBaseUrl = async (
  baseUrl: string,
  sitemapPath: string = "sitemap.xml"
) => {
  const url: URL = new URL(baseUrl);
  let base: string = `${url.protocol}//${url.hostname}`;

  if (url.port) {
    base += `:${url.port}`;
  }

  if (!base.endsWith("/")) {
    base += "/";
  }

  return `${base}${sitemapPath}`;
};

export const isObjectEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};

export const getHighLevelObject = (obj: any) => {
  if (typeof obj !== "object" || obj === null) {
    return null; // Return null for non-object values or null
  }

  const highLevelObject: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && typeof obj[key] !== "object") {
      highLevelObject[key] = obj[key];
    }
  }

  return highLevelObject;
};

const parseStringPromise = (xmlData: string) => {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (error: any, result: any) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

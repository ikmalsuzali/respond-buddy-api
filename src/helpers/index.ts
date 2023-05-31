const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const secretKey = "jXn2r5u8QfTjWnZr+MbQeThWD(G+KbPU";
const iv = crypto.randomBytes(16);

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
        user_id: "51edacbb-22d7-4f18-b1a7-d74f9f92b03d",
        workspace_id: "21fcef2f-ba46-41b1-a4a8-400022eed3fa",
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

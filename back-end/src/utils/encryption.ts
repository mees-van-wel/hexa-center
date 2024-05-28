import crypto from "crypto";

import { Stringified } from "~/types";

const IV_LENGTH = 16;

export type Encrypted<T> = Stringified<T>;

const encryptionKey = process.env.ENCRYPTION_KEY;

if (encryptionKey?.length !== 32)
  throw new Error(
    "Missing or invalid ENCRYPTION_KEY in .env.local, must be a 32-character string.",
  );

export const encrypt = (data: any) => {
  const text = JSON.stringify(data);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(encryptionKey),
    iv,
  );
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${encrypted}:${authTag.toString("base64")}`;
};

export const decrypt = (text: string): any => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift()!, "base64");
  const encryptedText = textParts.shift()!;
  const authTag = Buffer.from(textParts.shift()!, "base64");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(encryptionKey),
    iv,
  );
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
};

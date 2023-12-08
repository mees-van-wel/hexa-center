import crypto from "crypto";

export const createOtp = () => crypto.randomInt(1000, 9999).toString();

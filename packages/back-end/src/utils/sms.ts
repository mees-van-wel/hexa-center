import { Auth } from "@vonage/auth";
import { Vonage } from "@vonage/server-sdk";

const apiKey = process.env.VONAGE_API_KEY;
if (!apiKey) throw new Error("Missing VONAGE_API_KEY in .env.local");

const apiSecret = process.env.VONAGE_API_SECRET;
if (!apiSecret) throw new Error("Missing VONAGE_API_SECRET in .env.local");

const vonage = new Vonage(
  new Auth({
    apiKey,
    apiSecret,
  })
);

type SendSmsProps = {
  from?: string;
  to: string;
  message: string;
};

export const sendSms = ({ from = "Hexa Center", to, message }: SendSmsProps) =>
  vonage.sms.send({ from, to, text: message });

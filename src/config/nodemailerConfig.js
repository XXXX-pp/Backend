import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const authUser = process.env.GOOGLE_AUTH_USER;
const authPass = process.env.GOOGLE_AUTH_PASS;

export const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: authUser,
    pass: authPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
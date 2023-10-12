import { transport } from "../config/nodemailerConfig.js";
import dotenv from "dotenv";

dotenv.config();

const companyMail = process.env.COMPANY_MAIL;
const mailSubject = process.env.SUBJECT

// Function to send email with otp code 
export const sendEmail = async (email, message) => {

  const mailOptions = {
    from:companyMail,
    subject: mailSubject,
    to:email,
    html: message
  };

  return transport.sendMail(mailOptions);
};

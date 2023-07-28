// import nodemailer from "nodemailer";

// // Nodemailer Implemention
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.GOOGLE_AUTH_USER,
//     pass: process.env.GOOGLE_AUTH_PASS,
//   },
// });

//   // mailOptions
//     const mailOptions = {
//       from: "xxxcompany2.0@gmail.com",
//       to: email,
//       subject: "Verify Your Email",
//       html: `<p>Enter ${otp} </br> in the app to verify your email address and complete the signup process
//       <p>This code <b>expires in 1 hour.</b></p>
//     </p>`,
//     };

//     await transporter.sendMail(mailOptions);

// //testing success
// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Ready for message");
//     console.log(success);
//   }
// });

// export const mailer = async () => {

// }

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const authUser = process.env.GOOGLE_AUTH_USER;
const authPass = process.env.GOOGLE_AUTH_PASS;
const compMail = process.env.COMP_MAIL;
const mailSubject = process.env.SUBJECT


const transport = nodemailer.createTransport({
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

export const sendEmail = async (email, message) => {

  const mailOptions = {
          from:compMail,
          subject: mailSubject,
          to:email,
          html: message
        };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
};

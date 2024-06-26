import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465", // true for port 465, false for others
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("Error with transporter configuration:", error);
  } else {
    console.log("Email transporter is configured correctly");
  }
});

export default transporter;

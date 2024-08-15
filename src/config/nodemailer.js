import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});
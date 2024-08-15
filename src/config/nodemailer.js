import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  // service: process.env.NODEMAILER_SERVICE,
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    // user: process.env.NODEMAILER_USER,
    // pass: process.env.NODEMAILER_PASS,
    user: "kushalgupta1605@gmail.com",
    pass: "ubaq tzjk huxm yvjw",
  },
});
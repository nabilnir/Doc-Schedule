import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"DocSchedule"`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Email error:", error);
  }
};
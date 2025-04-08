const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.dreamhost.com", // DreamHost SMTP server
  port: 465, // Use port 465 for SSL
  secure: true, // Use true for SSL
  auth: {
    user: process.env.EMAIL_USER, // Your DreamHost email address
    pass: process.env.EMAIL_PASS, // Your DreamHost email password
  },
});

const sendEmail = async (to, subject, text, replyTo) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Your DreamHost email address
      to, // Recipient email address
      subject, // Email subject
      text, // Email body
      replyTo, // User's email address (for replies)
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = sendEmail;

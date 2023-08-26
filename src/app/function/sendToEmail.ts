import nodemailer from "nodemailer";

const sendEmail = async (to: string, subject: string, text: string) => {
  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "your-smtp-server.com", // replace with your SMTP server
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "your-email@example.com", // your email account
      pass: "your-email-password", // your email password
    },
  });

  // Set up email data
  const mailOptions = {
    from: "your-email@example.com", // sender address
    to: to, // list of receivers
    subject: subject, // subject line
    text: text, // plain text body
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "websiteofcharan@gmail.com", // use environment variables
        pass: "cplqsanjcqiepbhs",
      },
    });

    const info = await transporter.sendMail({
      from: "websiteofcharan@gmail.com", // sender address
      to, // recipient address
      subject, // Subject line
      text, // plain text body
    });

    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

module.exports = { sendEmail };

import * as nodeMailer from "nodemailer";

export const mailSender = async (
  email: string,
  subject: string,
  message: string
): Promise<void> => {
  try {
    console.log(
      "object ",
      process.env.SMTP_EMAIL,
      process.env.SMTP_PASSWORD,
      email,
      message
    );
    const transporter = nodeMailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      // service: process.env.SMTP_SERVICE,
      //secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions: nodeMailer.SendMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: subject,
      text: message,
    };

    if (!mailOptions.to) {
      throw new Error("Recipient's email address is missing");
    }

    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};


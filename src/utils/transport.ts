import nodemailer, {
  SendMailOptions,
  SentMessageInfo,
  Transporter,
} from "nodemailer";
import { config } from "./initEnv.js";

const smtp = {
  user: config.SMTP.USER,
  pass: config.SMTP.PASSWORD,
  host: config.SMTP.HOST,
  port: config.SMTP.PORT,
  secure: config.SMTP.SECURE,
};

const transporter: Transporter<SentMessageInfo> = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

// Helper function to determine the "from" email
const getFromEmail = () =>
  config.NODE_ENV === "development" ? "test@example.com" : config.SMTP.USER;

/* SEND EMAIL --------------------------------------------------------- */

const sendEmail = async (payload: SendMailOptions) => {
  const emailPayload = {
    ...payload,
    from: getFromEmail(),
  };

  transporter.sendMail(emailPayload, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return;
    }

    // Log the preview URL if in development mode
    if (config.NODE_ENV === "development") {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  });
};

export default sendEmail;

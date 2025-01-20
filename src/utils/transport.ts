import nodemailer, {
  SendMailOptions,
  SentMessageInfo,
  Transporter,
} from "nodemailer";
import { config } from "./initEnv.js";

// Function to create the development SMTP configuration
const createDevelopmentConfig = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return {
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    };
  } catch (error) {
    console.error("Error creating Ethereal account:", error);
    throw error;
  }
};

// Function to create the production SMTP configuration
const createProductionConfig = () => ({
  host: config.SMTP.HOST,
  port: config.SMTP.PORT,
  secure: config.SMTP.SECURE,
  auth: {
    user: config.SMTP.USER,
    pass: config.SMTP.PASSWORD,
  },
});

const createTransporter = async (): Promise<Transporter<SentMessageInfo>> => {
  const smtpConfig =
    config.NODE_ENV === "development"
      ? await createDevelopmentConfig()
      : createProductionConfig();

  return nodemailer.createTransport(smtpConfig);
};

const getFromEmail = () =>
  config.NODE_ENV === "development" ? "test@example.com" : config.SMTP.USER;

/* SEND EMAIL --------------------------------------------------------- */

const sendEmail = async (payload: SendMailOptions) => {
  try {
    const transporter = await createTransporter();

    const emailPayload = {
      ...payload,
      from: getFromEmail(),
    };

    transporter.sendMail(emailPayload, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return;
      }

      if (config.NODE_ENV === "development") {
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    });
  } catch (error) {
    console.error("Error in sendEmail function:", error);
  }
};

export default sendEmail;

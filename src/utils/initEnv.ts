import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* THIS FILE VERIFIES IF ALL ENV VARIABLES ARE SET
AND CONVERTS THE VALUES TO THEIR CORRECT DATA TYPE */

// Parsing Utils
const parseBoolean = (value: string | undefined): boolean => {
  if (value === undefined) return false;
  return value.toLowerCase() === "true";
};

const parseNumber = (value: string | undefined): number | undefined => {
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

const envFile = ".env";
dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

const getEnv = (key: string, defaultValue?: any): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    console.warn(
      `Environment variable ${key} is missing. Using default value: ${defaultValue}`
    );
  }

  return value || "";
};

// All .env variables
export const config = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: parseNumber(getEnv("PORT", "4004")),
  CLIENT_URL: getEnv("CLIENT_URL"),
  MONGO_URI: getEnv("MONGO_URI"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  SMTP: {
    USER: getEnv("SMTP_USER"),
    PASSWORD: getEnv("SMTP_PASSWORD"),
    HOST: getEnv("SMTP_HOST"),
    PORT: parseNumber(getEnv("SMTP_PORT", 587)),
    SECURE: parseBoolean(getEnv("SMTP_SECURE", "false")),
  },
};

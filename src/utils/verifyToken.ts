import jwt from "jsonwebtoken";
import { config } from "./initEnv.js";

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.JWT_SECRET); // Decodifica e valida o token
  } catch (err) {
    return null;
  }
};

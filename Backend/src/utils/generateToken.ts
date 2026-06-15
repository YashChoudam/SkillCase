import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";

const generateToken = (userId: number, email: string) => {
  return jwt.sign(
    {
      id: userId,
      email,
    },
    envConfig.jwtSecret,
    {
      expiresIn: envConfig.jwtExpiresIn as any,
    }
  );
};

export { generateToken };
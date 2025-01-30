import { Document, Types } from "mongoose";
import { AddictionEnum } from "./addiction.types.js";

export enum UserRolesEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}
/* INTERFACES ----------------------------------------------------------- */
export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface IUserModel extends CreateUserInput, Document {
  pfp: string;
  emailVerified: boolean;
  passwordResetCode: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRolesEnum;

  comparePassword(candidatePassword: string): Promise<boolean>;
  omitPrivateFields(): Partial<IUserModel>;
  generateAuthToken(): string;
  generateVerificationToken(): string;
}

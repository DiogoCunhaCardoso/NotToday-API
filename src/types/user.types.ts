import { Document, Types } from "mongoose";
import { AddictionEnum, SeverityEnum } from "./addiction.types.js";
import { IUserAddictionModel } from "./userAddiction.types.js";

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

export interface SetAddictionTypeInput {
  userId: string;
  addictionType: AddictionEnum;
}

export interface IUserModel extends CreateUserInput, Document {
  pfp: string;
  emailVerified: boolean;
  passwordResetCode: string;
  createdAt: Date;
  updatedAt: Date;
  addictions: Types.ObjectId[];

  comparePassword(candidatePassword: string): Promise<boolean>;
  omitPrivateFields(): Partial<IUserModel>;
  generateAuthToken(): string;
  generateVerificationToken(): string;
}

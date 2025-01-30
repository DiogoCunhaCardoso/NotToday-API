import mongoose, { Types } from "mongoose";
import { SeverityEnum } from "./addiction.types.js";

export interface IUserAddictionModel {
  addiction: mongoose.Types.ObjectId;// Reference to Addiction model
  userId: mongoose.Types.ObjectId;
  severity: SeverityEnum;
  soberDays: number;
}

export interface addAddictionToUserInput {
  addictionType: string;
}

export interface RemoveAddictionFromUserInput {
  addictionType: string;
}

export interface IncrementDaysSoberInput {
  addictionType: string;
}

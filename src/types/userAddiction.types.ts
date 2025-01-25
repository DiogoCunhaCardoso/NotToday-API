import mongoose, { Types } from "mongoose";
import { SeverityEnum } from "./addiction.types.js"; // Ensure this is the correct import path for SeverityEnum

export interface IUserAddictionModel {
  addiction: mongoose.Types.ObjectId; // Reference to Addiction model
  severity: SeverityEnum;
  soberDays: number;
}

export interface addAddictionToUserInput {
  userId: string; 
  addictionType: string
}

export interface RemoveAddictionFromUserInput {
  userId: string; 
  addictionType: string
}
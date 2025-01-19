import mongoose, { Schema } from "mongoose";
import {
  AddictionEnum,
  IAddictionModel,
  SeverityEnum,
} from "../../../types/addiction.types.js";

const addictionSchema: Schema<IAddictionModel> = new Schema({
  type: { type: String, enum: AddictionEnum, required: true },
  symptoms: { type: [String], required: true },
  treatmentOptions: { type: [String], required: true },
  severity: { type: String, enum: SeverityEnum, required: true },
  triggers: { type: [String], required: true },
  copingMechanisms: { type: [String], required: true },
});

export const AddictionModel = mongoose.model<IAddictionModel>(
  "Addiction",
  addictionSchema
);

import mongoose, { model, Schema } from "mongoose";
import { IUserMilestone, MilestoneNameEnum } from "../../../types/userMilestone.types.js";


// Definição do esquema do modelo UserMilestone
const userMilestoneSchema = new Schema<IUserMilestone>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Referência ao modelo User
      required: true,
    },
    name: {
      type: String,
      enum: MilestoneNameEnum,
      required: true,
    },
    level: {
      type: Number,
      min: 1,
      max: 7,
      required: true,
    },
    achievedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adiciona automaticamente createdAt e updatedAt
  }
);

// Exportação do modelo UserMilestone
export const UserMilestoneModel = model<IUserMilestone>("UserMilestone", userMilestoneSchema);
export default UserMilestoneModel;

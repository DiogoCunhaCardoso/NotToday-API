import { Schema, model, Document, Types } from "mongoose";
import { IDiaryModel } from "../../../types/diary.types";

// Define the diary schema
const diarySchema = new Schema<IDiaryModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create the Diary model
export const DiaryModel = model<IDiaryModel>("Diary", diarySchema);

export default DiaryModel;

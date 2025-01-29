import { Types } from "mongoose";

/* INTERFACES ----------------------------------------------------------- */

export interface CreateDiaryInput {
  title: string;
  content: string;
  date: Date;
}

export interface DiaryEntryInput {
  title: string;
  content: string;
}

export interface UpdateDiaryEntryInput {
  id: string;
  title?: string;
  content?: string;
}

export interface DeleteDiaryEntryInput {
  id: string;
}

export interface IDiaryModel extends CreateDiaryInput, Document {
  userId: Types.ObjectId;
}

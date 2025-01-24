import { Types } from "mongoose";

/* INTERFACES ----------------------------------------------------------- */

export interface CreateDiaryInput {
  title: string;
  content: string;
  date: Date;
}

export interface DiaryEntryInput {
  userId: string;
  title: string;
  content: string;
}

export interface UpdateDiaryEntryInput {
  id: string;
  userId: string;
  title?: string;
  content?: string;
}

export interface DeleteDiaryEntryInput {
  id: string;     
  userId: string; 
}


export interface IDiaryModel extends CreateDiaryInput, Document {
  userId: Types.ObjectId;
}

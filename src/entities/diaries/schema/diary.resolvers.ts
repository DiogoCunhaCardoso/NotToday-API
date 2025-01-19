import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import {
  DiaryEntryInput,
  UpdateDiaryEntryInput,
} from "../../../types/diary.types.js";
import { appAssert } from "../../../utils/appAssert.js";
import { DiaryModel } from "../models/diary.model.js";

/* #TODO nada disto está testado no Apollo Playground 
(http://localhost:4000/) vê se da e se adiciona a BD */

const diaryResolvers = {
  Query: {
    // Get all diary entries for a user
    diaryEntries: catchAsyncErrors(
      async (_, { userId }: { userId: string }) => {
        const entries = await DiaryModel.find({ userId });
        return entries;
      }
    ),
  },

  Mutation: {
    // Create a new diary entry
    createDiaryEntry: catchAsyncErrors(
      async (_, { input }: { input: DiaryEntryInput }) => {
        const { userId, title, content } = input;
        appAssert(
          userId && title && content,
          "MISSING_FIELDS",
          "All fields are required.",
          input
        );

        const newEntry = new DiaryModel({
          userId,
          title,
          content,
          date: new Date().toISOString(),
        });

        await newEntry.save();
        return newEntry;
      }
    ),

    // Update an existing diary entry
    updateDiaryEntry: catchAsyncErrors(
      async (_, { input }: { input: UpdateDiaryEntryInput }) => {
        const { id, title, content } = input;
        const entry = await DiaryModel.findById(id);
        appAssert(entry, "ENTRY_NOT_FOUND", "Diary entry not found.", { id });

        if (title) entry.title = title;
        if (content) entry.content = content;
        entry.date = new Date();

        await entry.save();
        return entry;
      }
    ),

    // Delete a diary entry
    deleteDiaryEntry: catchAsyncErrors(async (_, { id }: { id: string }) => {
      const entry = await DiaryModel.findByIdAndDelete(id);
      appAssert(entry, "ENTRY_NOT_FOUND", "Diary entry not found.", { id });

      return "Diary entry deleted successfully.";
    }),
  },
};

export default diaryResolvers;

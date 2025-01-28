import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import {
  DiaryEntryInput,
  UpdateDiaryEntryInput,
} from "../../../types/diary.types.js";
import { appAssert } from "../../../utils/appAssert.js";
import { DiaryModel } from "../models/diary.model.js";

const diaryResolvers = {
  Query: {
    // Get all diary entries for a user
    diaryEntries: catchAsyncErrors(async (_, __, { user }) => {
      const entries = await DiaryModel.find({ userId: user.id });
      return entries;
    }),
  },

  Mutation: {
    // Create a new diary entry
    createDiary: catchAsyncErrors(
      async (_, { input }: { input: DiaryEntryInput }, { user }) => {
        const { title, content } = input;
        const userId = user.id;

        appAssert(
          title && content,
          "MISSING_FIELDS",
          "All fields are required.",
          input
        );

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Check if a diary entry already exists for today
        const existingEntry = await DiaryModel.findOne({
          userId,
          date: { $gte: startOfDay, $lte: endOfDay },
        });

        appAssert(
          !existingEntry,
          "DIARY_ALREADY_EXISTS",
          "You have already created a diary entry today.",
          { userId, date: new Date().toISOString() }
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
    updateDiary: catchAsyncErrors(
      async (_, { input }: { input: UpdateDiaryEntryInput }, { user }) => {
        const { id, title, content } = input;
        const entry = await DiaryModel.findById(id);

        const userId = user.id;
        appAssert(entry, "ENTRY_NOT_FOUND", "Diary entry not found.", { id });

        appAssert(
          entry.userId.toString() === userId,
          "UNAUTHORIZED",
          "Unauthorized: You cannot update this diary entry.",
          { userId: userId }
        );

        if (title) entry.title = title;
        if (content) entry.content = content;
        entry.date = new Date();

        await entry.save();
        return entry;
      }
    ),

    // Delete a diary entry
    deleteDiary: catchAsyncErrors(
      async (_, { id }: { id: string }, { user }) => {
        const entry = await DiaryModel.findById(id);

        const userId = user.id;
        appAssert(entry, "ENTRY_NOT_FOUND", "Diary entry not found.", { id });

        appAssert(
          entry.userId.toString() === userId,
          "UNAUTHORIZED",
          "Unauthorized: You cannot update this diary entry.",
          { userId: userId }
        );

        // Delete the journal
        await DiaryModel.findByIdAndDelete(id);

        // Return a success message
        return "Diary entry deleted successfully.";
      }
    ),
  },
};

export default diaryResolvers;

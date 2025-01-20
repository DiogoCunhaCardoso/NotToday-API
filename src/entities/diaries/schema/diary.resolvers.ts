import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import {
  DiaryEntryInput,
  UpdateDiaryEntryInput,
  DeleteDiaryEntryInput
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
    createDiary: catchAsyncErrors(
      async (_, { input }: { input: DiaryEntryInput }) => {
        const { userId, title, content } = input;
    
        appAssert(
          userId && title && content,
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
      async (_, { input }: { input: UpdateDiaryEntryInput }) => {
        const { id, title, content, userId } = input;
        const entry = await DiaryModel.findById(id);
        appAssert(entry, "ENTRY_NOT_FOUND", "Diary entry not found.", { id });

        if (entry.userId.toString() !== userId) {
          throw new Error("Unauthorized: You cannot update this diary entry.");
        }

        if (title) entry.title = title;
        if (content) entry.content = content;
        entry.date = new Date();

        await entry.save();
        return entry;
      }
    ),

    // Delete a diary entry
    deleteDiary: catchAsyncErrors(
      async (_, { input }: { input: DeleteDiaryEntryInput }) => {
        const { id, userId } = input;
        const entry = await DiaryModel.findById(id);
        
        // Verificar se o diário existe
        appAssert(entry, "ENTRY_NOT_FOUND", "Diary entry not found.", { id });
    
        // Verificar se o diário pertence ao utilizador
        appAssert(entry.userId.toString() === userId, "UNAUTHORIZED", "You cannot delete this diary entry.", { userId });
    
        // Excluir o diário
        await DiaryModel.findByIdAndDelete(id);
    
        // Retornar uma mensagem de sucesso
        return "Diary entry deleted successfully.";
      }
    ),
  },
};



export default diaryResolvers;

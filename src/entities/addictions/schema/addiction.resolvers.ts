import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import {
  createAddictionInput,
  IAddictionModel,
  updateAddictionInput,
} from "../../../types/addiction.types.js";
import { appAssert } from "../../../utils/appAssert.js";
import { AddictionModel } from "../models/addiction.model.js";

const addictionResolvers = {
  Query: {
    // Get a specific addiction by ID
    addiction: catchAsyncErrors(async (_: any, { id }: { id: string }) => {
      const addiction = await AddictionModel.findById(id);
      appAssert(addiction, "ADDICITON_NOT_FOUND", "Addiction not found", {
        id,
      });
      return addiction;
    }),

    // Get all addictions
    addictions: catchAsyncErrors(async () => {
      return await AddictionModel.find();
    }),
  },

  Mutation: {
    // Create a new addiction
    createAddiction: catchAsyncErrors(
      async (_: any, { input }: { input: createAddictionInput }) => {
        const newAddiction = new AddictionModel(input);
        await newAddiction.save();
        return newAddiction;
      }
    ),

    // Update an existing addiction
    updateAddiction: catchAsyncErrors(
      async (_: any, { input }: { input: updateAddictionInput }) => {
        const { id, ...updates } = input;
        const addiction = await AddictionModel.findByIdAndUpdate(id, updates, {
          new: true,
        });
        appAssert(addiction, "ADDICITON_NOT_FOUND", "Addiction not found", {
          id,
        });
        return addiction;
      }
    ),

    // Delete an addiction
    deleteAddiction: catchAsyncErrors(
      async (_: any, { input }: { input: { id: string } }) => {
        const { id } = input;
        const addiction = await AddictionModel.findByIdAndDelete(id);
        appAssert(addiction, "ADDICITON_NOT_FOUND", "Addiction not found", {
          id,
        });
        return "Addiction deleted successfully.";
      }
    ),
  },
};

export default addictionResolvers;

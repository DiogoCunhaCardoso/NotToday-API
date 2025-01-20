import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import {
  createAddictionInput,
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
        const {type} = input;
    
        const existingAddiction = await AddictionModel.findOne({ type });
    
        if (existingAddiction) {
          appAssert(
            !existingAddiction, 
            "ADDICTION_ALREADY_EXISTS",
            "An addiction with this type already exists.",
            { type }
          );
        }
    
        // If no duplicate is found, proceed with creation
        const newAddiction = new AddictionModel(input);
        await newAddiction.save();
        return newAddiction;
      }
    ),
    

    // Update an existing addiction
    updateAddiction: catchAsyncErrors(
      async (_: any, { input }: { input: updateAddictionInput }) => {
        const { _id, type, ...updates } = input;
    
        // Find the addiction by its ID
        const addictionToUpdate = await AddictionModel.findById(_id);
    
        // If no addiction exists with the given _, throw an error
        appAssert(
          addictionToUpdate,
          "ADDICTION_NOT_FOUND",
          "No addiction found with this ID.",
          { _id }
        );
    
        // If the update includes a new type, check if it already exists in another addiction
        if (type && type !== addictionToUpdate.type) {
          const existingAddiction = await AddictionModel.findOne({
            type, // Check if the new type already exists
            _id: { $ne: _id }, // Exclude the current addiction being updated
          });
    
          appAssert(
            !existingAddiction,
            "ADDICTION_ALREADY_EXISTS",
            "An addiction with this type already exists.",
            { type }
          );
        }
    
        // Proceed with update
        const updatedAddiction = await AddictionModel.findByIdAndUpdate(
          _id, // Find addiction by ID
          { type, ...updates }, // Update fields
          { new: true }
        );
    
        return updatedAddiction;
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

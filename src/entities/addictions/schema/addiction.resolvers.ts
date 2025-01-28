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
        const { type } = input;

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
      async (_, { input }: { input: updateAddictionInput }) => {
        const {
          _id,
          type,
          severity,
          symptoms,
          treatmentOptions,
          triggers,
          copingMechanisms,
        } = input;

        // Search for addition by ID
        const addiction = await AddictionModel.findByIdAndUpdate(_id);
        console.log("Found addiction:", addiction); // Debugging

        appAssert(
          addiction,
          "ADDICTION_NOT_FOUND",
          "No addiction found with this ID.",
          { _id }
        );

        // Update only the submitted fields
        if (type) addiction.type = type;
        if (severity) addiction.severity = severity;
        if (symptoms) addiction.symptoms = symptoms;
        if (treatmentOptions) addiction.treatmentOptions = treatmentOptions;
        if (triggers) addiction.triggers = triggers;
        if (copingMechanisms) addiction.copingMechanisms = copingMechanisms;

        await addiction.save();

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

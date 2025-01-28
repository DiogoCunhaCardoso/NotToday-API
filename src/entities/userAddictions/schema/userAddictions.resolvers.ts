import mongoose, { Types } from "mongoose";
import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import { appAssert } from "../../../utils/appAssert.js";
import { AddictionModel } from "../../addictions/models/addiction.model.js";
import UserModel from "../../users/model/user.model.js";
import {
  addAddictionToUserInput,
  RemoveAddictionFromUserInput,
} from "../../../types/userAddiction.types.js";
import UserAddictionModel from "../models/userAddictions.model.js";

const userAddictionResolvers = {
  Mutation: {
    // Add an addiction to a user
    addAddictionToUser: catchAsyncErrors(
      async (_, { input }: { input: addAddictionToUserInput }, { user }) => {
        const { addictionType } = input;

        // Ensure addiction exists
        const addiction = await AddictionModel.findOne({ type: addictionType });
        appAssert(
          addiction,
          "ADDICTION_NOT_FOUND",
          "Addiction type not found.",
          { addictionType }
        );

        // Create a new user addiction entry
        const newUserAddiction = await UserAddictionModel.create({
          addiction: addiction._id, // Store reference ID
          severity: "LOW",
          soberDays: 0,
        });

        // Add addiction ObjectId to user
        user.addictions.push(newUserAddiction._id);
        await user.save();

        // Ensure `addictions` are properly populated before returning
        const updatedUser = await UserModel.findById(user.id).populate(
          "addictions"
        );

        return updatedUser;
      }
    ),

    //Create removeAddictionFromUser
    removeAddictionFromUser: catchAsyncErrors(
      async (
        _,
        { input }: { input: RemoveAddictionFromUserInput },
        { user }
      ) => {
        const { addictionType } = input;

        const addiction = await AddictionModel.findOne({ type: addictionType });
        appAssert(
          addiction,
          "ADDICTION_NOT_FOUND",
          "Addiction type not found.",
          { addictionType }
        );

        const userAddiction = await UserAddictionModel.findOneAndDelete({
          addiction: addiction._id,
        });
        appAssert(
          userAddiction,
          "USER_ADDICTION_NOT_FOUND",
          "User addiction not found.",
          { addictionType }
        );

        user.addictions = user.addictions.filter(
          (addictionId) => !addictionId.equals(userAddiction._id)
        );

        await user.save();

        const updatedUser = await UserModel.findById(user.id).populate(
          "addictions"
        );
        return updatedUser;
      }
    ),
  },
};

export default userAddictionResolvers;

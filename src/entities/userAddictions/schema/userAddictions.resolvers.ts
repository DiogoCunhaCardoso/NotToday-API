import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import { appAssert } from "../../../utils/appAssert.js";
import { AddictionModel } from "../../addictions/models/addiction.model.js";
import {
  addAddictionToUserInput,
  IncrementDaysSoberInput,
  RemoveAddictionFromUserInput,
} from "../../../types/userAddiction.types.js";
import UserAddictionModel from "../models/userAddictions.model.js";
import { PubSub } from "graphql-subscriptions";
import { milestonesLevels } from "../../../utils/milestone_levels.js";

const pubsub = new PubSub();

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

        // Check if the user already has this addiction
        const existingUserAddiction = await UserAddictionModel.findOne({
          addiction: addiction._id,
          userId: user.id,
        });

        appAssert(
          !existingUserAddiction,
          "DUPLICATE_ADDICTION",
          "You have already added this addiction.",
          { addictionType }
        );

        // Create a new user addiction entry
        const newUserAddiction = await UserAddictionModel.create({
          addiction: addiction._id, // Store reference ID
          userId: user.id,
          severity: "LOW",
          soberDays: 0,
        });

        await newUserAddiction.save();

        return newUserAddiction;
      }
    ),

    //Create removeAddictionFromUser
    removeAddictionFromUser: catchAsyncErrors(
      async (_, { input }: { input: RemoveAddictionFromUserInput }, { user }) => {
        const { addictionType } = input;

        // Find the addiction
        const addiction = await AddictionModel.findOne({ type: addictionType });
        appAssert(
          addiction,
          "ADDICTION_NOT_FOUND",
          "Addiction type not found.",
          { addictionType }
        );

        // Check if the user is trying to remove their own addiction
        const userAddiction = await UserAddictionModel.findOne({
          addiction: addiction._id,
          userId: user.id,
        });

        appAssert(
          userAddiction,
          "USER_ADDICTION_NOT_FOUND",
          "User addiction not found.",
          { addictionType }
        );

        // Delete the addiction from the user's record
        await UserAddictionModel.findOneAndDelete({
          addiction: addiction._id,
          userId: user.id,
        });

        // Return the updated list of the user's addictions
        const userAddictions = UserAddictionModel.find({ userId: user.id });
        return userAddictions;
      }
    ),


    incrementDaysSober: catchAsyncErrors(
      async (_, { input }: { input: IncrementDaysSoberInput }) => {
        const { addictionType } = input;
        console.log("1 " + addictionType);
    
        // Find the addiction
        const addiction = await AddictionModel.findOne({ type: addictionType });
        console.log("2 " + addiction);
    
        appAssert(
          addiction,
          "ADDICTION_NOT_FOUND",
          "Addiction type not found.",
          { addictionType }
        );
    
        // Convert ObjectId to string before querying
        const addictionIdString = addiction._id.toString();
        console.warn('2.5 ' + addictionIdString);
        
    
        // Find the user's addiction entry
        const userAddiction = await UserAddictionModel.findOne({
          addiction: addictionIdString, // Now it's a string
        });
    
        console.log("3 " + userAddiction);
    
        appAssert(
          userAddiction,
          "USER_ADDICTION_NOT_FOUND",
          "User addiction not found.",
          { addictionType }
        );
    
        // Increment sober days
        userAddiction.soberDays = (userAddiction.soberDays || 0) + 1;
        await userAddiction.save();

        let subscriptionText = `You are ${userAddiction.soberDays} days sober.`;
        
        milestonesLevels.forEach(milestone => {
          if (userAddiction.soberDays == milestone.days) {
            subscriptionText += ` You reached level ${milestone.level}: ${milestone.name}`
          }
        });
    
        // Publish an event (optional `await` for better handling)
        await pubsub.publish("DAYS_SOBER", { newSoberDayNotification:  subscriptionText});
    
        return userAddiction;
      }
    ),
    
  },
  Subscription: {
    newSoberDayNotification: {
      subscribe: () =>
        pubsub.asyncIterableIterator(["DAYS_SOBER"]),
    },
  },
}

export default userAddictionResolvers;

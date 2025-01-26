import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import {UserMilestoneModel} from "../models/userMilestone.model.js";
import { appAssert } from "../../../utils/appAssert.js";
import { CreateUserMilestoneInput } from "../../../types/userMilestone.types.js";
import { pubsub } from "./pubsub.js";

const userMilestoneResolvers = {
  Query: {
    getUserMilestones: catchAsyncErrors(async (_, { userId }: { userId: string }) => {
      const milestones = await UserMilestoneModel.find({ userId });
      appAssert(milestones.length, "MILESTONES_NOT_FOUND", "No milestones found for this user.");
      return milestones;
    }),
  },

  Mutation: {
    createUserMilestone: catchAsyncErrors(
      async (_, { input }: { input: CreateUserMilestoneInput }) => {
        const newMilestone = new UserMilestoneModel(input);
        await newMilestone.save();
        return newMilestone;
      }
    ),

    deleteUserMilestone: catchAsyncErrors(async (_, { id }: { id: string }) => {
      const milestone = await UserMilestoneModel.findByIdAndDelete(id);
      appAssert(milestone, "MILESTONE_NOT_FOUND", "Milestone not found", { id });
      return "Milestone deleted successfully.";
    }),
  },

  Subscription: {
    milestoneAchieved: {
      subscribe: () => pubsub.asyncIterableIterator(["MILESTONE_ACHIEVED"]),
       /* When a client subscribes to an event (in this case, "MILESTONE_ACHIEVED"), 
       the subscription listens for new published events. When you call pubsub.publish("MILESTONE_ACHIEVED", ...), 
       the asyncIterableIterator will emit the data to all connected clients that are subscribed to that event. */
    },
  },
};

export default userMilestoneResolvers;

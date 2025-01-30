import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import { UserMilestoneModel } from "../models/userMilestone.model.js";
import { appAssert } from "../../../utils/appAssert.js";
import { CreateUserMilestoneInput } from "../../../types/userMilestone.types.js";

const CHECK_INTERVAL = 10 * 60 * 1000;


const userMilestoneResolvers = {
  Query: {
    userMilestones: catchAsyncErrors(async (_, __, { user }) => {
      const milestones = await UserMilestoneModel.find({ userId: user.id });
      return milestones;
    }),
  },

  Mutation: {
    createUserMilestone: catchAsyncErrors(
      async (_, { input }: { input: CreateUserMilestoneInput }, { user }) => {
        const newMilestone = new UserMilestoneModel({
          ...input,
          userId: user.id,
        });

        await newMilestone.save();
        return newMilestone;
      }
    ),

    deleteUserMilestone: catchAsyncErrors(
      async (_, { id }: { id: string }, { user }) => {
        const milestone = await UserMilestoneModel.findByIdAndDelete(id);

        // Assert that milestone was found
        appAssert(milestone, "MILESTONE_NOT_FOUND", "Milestone not found", {
          id,
        });

        // Check if the authenticated user is the owner of the milestone
        appAssert(
          milestone.userId.toString() === user.id,
          "UNAUTHORIZED",
          "You are not authorized to delete this milestone."
        );

        await UserMilestoneModel.findByIdAndDelete(id);

        return "Milestone deleted successfully.";
      }
    ),
  },
 
};

export default userMilestoneResolvers;

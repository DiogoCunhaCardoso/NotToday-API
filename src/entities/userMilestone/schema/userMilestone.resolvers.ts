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
      async (_, { input }: { input: CreateUserMilestoneInput }, context) => {
        const newMilestone = new UserMilestoneModel(input);
        
        console.log("Role do user autenticado:", context.user);
        // Verifica se o utilizador está autenticado e possui permissão
          if (!context.user) {
            throw new Error("Sem token. Faça login para continuar.");
          }

           // Verifica se o role do utilizador é "USER" ou "ADMIN"
           if (context.user.role !== "USER" && context.user.role !== "ADMIN") {
            throw new Error("Você não tem permissão para adicionar vícios a outro user.");
          }
          console.log("Role do user autenticado:", context.user.role);
        await newMilestone.save();
        return newMilestone;
      }
    ),

    deleteUserMilestone: catchAsyncErrors(async (_, { id }: { id: string }, context) => {
      const milestone = await UserMilestoneModel.findByIdAndDelete(id);
      
      console.log("Role do user autenticado:", context.user);
      // Verifica se o utilizador está autenticado e possui permissão
        if (!context.user) {
          throw new Error("Sem token. Faça login para continuar.");
        }

         // Verifica se o role do utilizador é "USER" ou "ADMIN"
         if (context.user.role !== "USER" && context.user.role !== "ADMIN") {
          throw new Error("Você não tem permissão para adicionar vícios a outro user.");
        }
        console.log("Role do user autenticado:", context.user.role);
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

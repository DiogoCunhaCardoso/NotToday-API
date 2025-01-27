import mongoose, { Types } from "mongoose";
import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import { appAssert } from "../../../utils/appAssert.js";
import { AddictionModel } from "../../addictions/models/addiction.model.js";
import UserModel from "../../users/model/user.model.js";
import { addAddictionToUserInput, RemoveAddictionFromUserInput } from "../../../types/userAddiction.types.js";
import UserAddictionModel from "../models/userAddictions.model.js";


const userAddictionResolvers = {
  Mutation: {
      // Add an addiction to a user
      addAddictionToUser: catchAsyncErrors(async (_, { input }: { input: addAddictionToUserInput }, context) => {
        const { userId, addictionType } = input;
        console.log("Token recebido:", context.token);
  
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


        // Ensure user exists
        const user = await UserModel.findById(userId);
        appAssert(user, "USER_NOT_FOUND", "User not found.", { userId });
  
        // Ensure addiction exists
        const addiction = await AddictionModel.findOne({ type: addictionType });
        appAssert(addiction, "ADDICTION_NOT_FOUND", "Addiction type not found.", { addictionType });
  
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
        const updatedUser = await UserModel.findById(userId).populate("addictions");
  
        return updatedUser;
      }),
    
    
  
      //Create removeAddictionFromUser
      removeAddictionFromUser: catchAsyncErrors(async (_, { input }: { input: RemoveAddictionFromUserInput }, context) => {
        const { userId, addictionType } = input; 
      
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
         
        
        const user = await UserModel.findById(userId);
        appAssert(user, "USER_NOT_FOUND", "User not found.", { userId });
      
        const addiction = await AddictionModel.findOne({ type: addictionType });
        appAssert(addiction, "ADDICTION_NOT_FOUND", "Addiction type not found.", { addictionType });
      
        const userAddiction = await UserAddictionModel.findOneAndDelete({
          addiction: addiction._id,
        });
        appAssert(userAddiction, "USER_ADDICTION_NOT_FOUND", "User addiction not found.", { addictionType });
      
        user.addictions = user.addictions.filter(
          (addictionId) => !addictionId.equals(userAddiction._id)
        );
      
        await user.save();
      
        const updatedUser = await UserModel.findById(userId).populate("addictions");
        return updatedUser;
      }),      
    },
  };
      


export default userAddictionResolvers;

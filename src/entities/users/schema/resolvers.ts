import { UserModel } from "../model/user.model.js";
import { appAssert } from "../../../utils/appAssert.js";
import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import {
  CreateUserInput,
  LoginUserInput,
  SetAddictionTypeInput,
} from "../../../types/user.types.js";
import { AddictionEnum } from "../../../types/addiction.types.js";
import sendEmail from "../../../utils/transport.js";
import { getVerifyEmailTemplate } from "../../../utils/emailTemplate.js";
import { config } from "../../../utils/initEnv.js";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 20;

const userResolvers = {
  Query: {
    // Obter um usuário específico pelo ID
    user: catchAsyncErrors(async (_, { id }: { id: string }) => {
      const user = await UserModel.findById(id);
      appAssert(user, "USER_NOT_FOUND", "User not found", {
        description: "No user exists with the given ID.",
      });
      return user;
    }),

    // Obter uma lista completa de usuários (sem paginação)
    users: catchAsyncErrors(async () => {
      return await UserModel.find();
    }),

    // Retornar o total de usuários cadastrados
    totalUsers: catchAsyncErrors(async () => {
      return await UserModel.countDocuments();
    }),

    
    paginatedUsers: catchAsyncErrors(async (_, { limit, offset }, context) => {
      // Apenas ADMIN pode acessar
      appAssert(context.user?.role === "ADMIN", "UNAUTHORIZED", "Access denied.");

      const users = await UserModel.find().skip(offset).limit(limit);
      const totalUsers = await UserModel.countDocuments();

      return { users, totalUsers };
    }),
  },

  Mutation: {
    createUser: catchAsyncErrors(
      async (_, { input }: { input: CreateUserInput }) => {
        const { name, email, password } = input;
        // Check if all three fields are provided
        appAssert(name, "MISSING_FIELDS", "Name is required.", {
          name,
          email,
          password,
        });
        appAssert(email, "MISSING_FIELDS", "Email is required.", {
          name,
          email,
          password,
        });
        appAssert(password, "MISSING_FIELDS", "Password is required.", {
          name,
          email,
          password,
        });

        const isEmailValid = EMAIL_REGEX.test(email);
        // Check if email is valid
        appAssert(
          isEmailValid,
          "INVALID_EMAIL",
          "The provided email is not valid.",
          { email }
        );

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        appAssert(
          !existingUser,
          "USER_ALREADY_EXISTS",
          "Email is already in use.",
          { email }
        );

        // Check password length
        appAssert(
          password.length >= MIN_PASSWORD_LENGTH &&
            password.length <= MAX_PASSWORD_LENGTH,
          "INVALID_PASSWORD_LENGTH",
          `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`,
          { passwordLength: password.length }
        );

        // Create user
        const newUser = new UserModel({ name, email, password });
        const savedUser = await newUser.save();

        appAssert(savedUser, "USER_CREATION_FAILED", "User creation failed.");

        // Generate email verification link (using a verification token)
        const verificationToken = newUser.generateVerificationToken();
        const verificationUrl = `${config.CLIENT_URL}/verify-email?token=${verificationToken}`;

        // Get email template
        const emailTemplate = getVerifyEmailTemplate(verificationUrl);

        // Send verification email
        try {
          await sendEmail({
            to: email,
            subject: emailTemplate.subject,
            text: emailTemplate.text,
            html: emailTemplate.html,
          });
        } catch (error) {
          console.error("Error sending verification email:", error);
        }

        // Return the created user with private fields omitted
        return newUser.omitPrivateFields();
      }
    ),

    login: catchAsyncErrors(async (_, { input }: { input: LoginUserInput }) => {
      const { email, password } = input;
      const user = await UserModel.findOne({ email });
      appAssert(user, "WRONG_CREDENTIALS", "Wrong Credentials");

      // Compare the provided password with the stored password
      const isPasswordValid = await user.comparePassword(password);
      appAssert(isPasswordValid, "WRONG_CREDENTIALS", "Wrong Credentials");

      // Generate JWT token
      const token = user.generateAuthToken();
      return { user, token };
    }),

    /* setAddictionType: catchAsyncErrors(
      async (_, { userId, addictionType }: SetAddictionTypeInput) => {
        // Validate addictionType
        appAssert(
          Object.values(AddictionEnum).includes(addictionType),
          "INVALID_ADDICTION_TYPE",
          "Invalid addiction type provided.",
          { addictionType }
        );

        // Find user and update addiction type
        const user = await UserModel.findById(userId);
        appAssert(user, "USER_NOT_FOUND", "User not found", { userId });

        user.addictionType = addictionType;
        await user.save();
        return user;
      }
    ), */

    deleteUser: catchAsyncErrors(async (_, { id }: { id: string }) => {
      const user = await UserModel.findByIdAndDelete(id);
      appAssert(user, "USER_NOT_FOUND", "User not found", { id });
      return { message: "User deleted successfully." };
    }),

    resetPassword: catchAsyncErrors(
      async (
        _,
        { userId, newPassword }: { userId: string; newPassword: string }
      ) => {
        appAssert(
          newPassword.length >= MIN_PASSWORD_LENGTH &&
            newPassword.length <= MAX_PASSWORD_LENGTH,
          "INVALID_PASSWORD_LENGTH",
          `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`,
          { passwordLength: newPassword.length }
        );

        const user = await UserModel.findById(userId);
        appAssert(user, "USER_NOT_FOUND", "User not found", { userId });

        user.password = newPassword; // I hash the password in the UserModel pre-save hook.
        await user.save();
        return { message: "Password reset successfully." };
      }
    ),

   /*  incrementDaysSober: catchAsyncErrors(
      async (_, { userId }: { userId: string }) => {
        const user = await UserModel.findById(userId);
        appAssert(user, "USER_NOT_FOUND", "User not found", { userId });

        user.daysSober = (user.daysSober || 0) + 1;
        await user.save();
        return user;
      }
    ), */
  },
};

export default userResolvers;

// add reasons the person has to do something to a list. so it appears on the home page
// Get all users dealing with a specific addiction type.

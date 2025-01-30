import { UserModel } from "../model/user.model.js";
import { appAssert } from "../../../utils/appAssert.js";
import { catchAsyncErrors } from "../../../middleware/catchAsyncErrors.js";
import { CreateUserInput, LoginUserInput } from "../../../types/user.types.js";
import sendEmail from "../../../utils/transport.js";
import { getVerifyEmailTemplate } from "../../../utils/emailTemplate.js";
import { config } from "../../../utils/initEnv.js";
import { verifyToken } from "../../../utils/verifyToken.js";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 20;

const userResolvers = {
  Query: {
    me: catchAsyncErrors(async (_, __, { user }) => {
      const loggedUser = await UserModel.findById(user.id);
      appAssert(loggedUser, "USER_NOT_FOUND", "User not found", {
        description: "No user exists with the given ID.",
      });
      return loggedUser;
    }),

    usersCount: catchAsyncErrors(async () => {
      return await UserModel.countDocuments();
    }),

    paginatedUsers: catchAsyncErrors(async (_, { limit, offset }) => {
      const users = await UserModel.find().skip(offset).limit(limit);
      const usersCount = await UserModel.countDocuments();

      return { users, usersCount };
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
      let user = await UserModel.findOne({ email });
      appAssert(user, "WRONG_CREDENTIALS", "Wrong Credentials");

      // Compare the provided password with the stored password
      const isPasswordValid = await user.comparePassword(password);
      appAssert(isPasswordValid, "WRONG_CREDENTIALS", "Wrong Credentials");

      // Generate JWT token
      const token = user.generateAuthToken();
      return { user, token };
    }),

    deleteMe: catchAsyncErrors(async (_, __, { user }) => {
      const loggedUser = await UserModel.findByIdAndDelete(user.id);

      appAssert(loggedUser, "USER_NOT_FOUND", "User not found", {
        id: user.id,
      });

      return { message: "Logged Account deleted successfully." };
    }),

    deleteUser: catchAsyncErrors(async (_, { id }: { id: string }) => {
      const user = await UserModel.findByIdAndDelete(id);

      appAssert(user, "USER_NOT_FOUND", "User not found", { id });
      return { message: "User deleted successfully." };
    }),

    resetPassword: catchAsyncErrors(
      async (_, { newPassword }: { newPassword: string }, { user }) => {
        appAssert(
          newPassword.length >= MIN_PASSWORD_LENGTH &&
            newPassword.length <= MAX_PASSWORD_LENGTH,
          "INVALID_PASSWORD_LENGTH",
          `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`,
          { passwordLength: newPassword.length }
        );

        const foundUser = await UserModel.findById(user.id);
        appAssert(foundUser, "USER_NOT_FOUND", "User not found", {
          userId: user.id,
        });

        foundUser.password = newPassword; // I hash the password in the UserModel pre-save hook.
        await foundUser.save();
        return { message: "Password reset successfully." };
      }
    ),

    verifyEmail: catchAsyncErrors(async (_, { token }: { token: string }) => {
      // Verify and decode the token
      const decoded = verifyToken(token);
      appAssert(
        decoded,
        "INVALID_TOKEN",
        "The token is invalid or has expired."
      );

      const userId = decoded.id;

      // Find the user
      const user = await UserModel.findById(userId);
      appAssert(user, "USER_NOT_FOUND", "User not found.");

      // Mark the user as verified
      user.emailVerified = true;
      await user.save();

      return "Email verified successfully!";
    }),
  },
};

export default userResolvers;

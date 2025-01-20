import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserModel } from "../../../types/user.types.js";
import { AddictionEnum, SeverityEnum } from "../../../types/addiction.types.js";
import lodash from "lodash";
const { omit } = lodash;
import { config } from "../../../utils/initEnv.js";
import UserAddictionModel from "../../userAddictions/models/userAddictions.model.js";

// Define fields to be omitted for privacy
export const privateFields = [
  "emailVerified",
  "passwordResetCode",
  "password",
  "__v",
];

// Define the user schema
const userSchema = new Schema<IUserModel>(
  {
    name: { type: String, required: true },
    pfp: { type: String },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetCode: { type: String },
    password: { type: String, required: true },
    addictions: [{ type: Schema.Types.ObjectId, ref: "UserAddiction" }],
  },
  { timestamps: true }
);

/* HASH PASSWORDS BEFORE SAVING ------------------------------------------ */

userSchema.pre("save", async function (next) {
  let user = this as IUserModel;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;
  return next();
});

/* COMPARE PASSWORDS ----------------------------------------------------- */

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUserModel;
  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

/* GENERATE TOKEN -------------------------------------------------------- */

userSchema.methods.generateAuthToken = function () {
  const payload = { id: this._id, email: this.email };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "1h" });
};

/* GENERATE VERIFICATION TOKEN ------------------------------------------- */

userSchema.methods.generateVerificationToken = function () {
  const payload = { id: this._id, email: this.email };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "48h" });
};

/* OMIT PRIVATE FIELDS --------------------------------------------------- */

userSchema.methods.omitPrivateFields = function (): Partial<IUserModel> {
  return omit(this.toJSON(), privateFields);
};

/* CREATE MODEL ----------------------------------------------------- */

export const UserModel = model<IUserModel>("User", userSchema);

export default UserModel;

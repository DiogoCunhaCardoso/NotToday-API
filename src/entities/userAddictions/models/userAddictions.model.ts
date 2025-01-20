import { model, Schema } from "mongoose";
import { IUserAddictionModel } from "../../../types/userAddiction.types.js";
import { SeverityEnum } from "../../../types/addiction.types.js";

const userAddictionSchema = new Schema<IUserAddictionModel>(
    {
      addiction: {
        type: Schema.Types.ObjectId,
        ref: "Addiction", // References the Addiction model by ID
        required: true,
      },
      severity: {
        type: String,
        enum: Object.values(SeverityEnum),
        default: SeverityEnum.LOW,
      },
      soberDays: {
        type: Number,
        default: 0,
      },
    },
  );


  export const UserAddictionModel = model<IUserAddictionModel>("UserAddiction", userAddictionSchema);
  
  export default UserAddictionModel;

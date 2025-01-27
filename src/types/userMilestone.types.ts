import mongoose from "mongoose";



export enum MilestoneNameEnum{
  Awakening = "Awakening",
  Determination = "Determination",
  Resilience = "Resilience",
  Balance = "Balance",
  Mastery = "Mastery",
  Freedom = "Freedom",
  Enlightenment = "Enlightenment",
}

export interface IUserMilestone {
    userId: mongoose.Schema.Types.ObjectId;
    name: MilestoneNameEnum;
    level: number;
    achievedDate?: Date;
  }

  export interface CreateUserMilestoneInput {
    userId: string
    name: MilestoneNameEnum
    level: number
  }

  
  
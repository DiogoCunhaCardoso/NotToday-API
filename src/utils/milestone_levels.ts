import { MilestoneNameEnum } from "../types/userMilestone.types.js";

// Lista de milestones com dias, nome e nível
export const milestonesLevels = [
  { days: 7, name: MilestoneNameEnum.Awakening, level: 1 },
  { days: 14, name: MilestoneNameEnum.Balance, level: 2 },
  { days: 30, name: MilestoneNameEnum.Determination, level: 3 },
  { days: 60, name: MilestoneNameEnum.Enlightenment, level: 4 },
  { days: 90, name: MilestoneNameEnum.Freedom, level: 5 },
  { days: 180, name: MilestoneNameEnum.Mastery, level: 6 },
  { days: 365, name: MilestoneNameEnum.Resilience, level: 7 },
];
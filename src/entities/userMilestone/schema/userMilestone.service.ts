import { MilestoneNameEnum } from "../../../types/userMilestone.types.js";
import { UserMilestoneModel } from "../models/userMilestone.model.js";
import { pubsub } from "./pubsub.js"; // Importa o PubSub

// Lista de milestones com dias, nome e nível
const milestones = [
  { days: 7, name: MilestoneNameEnum.Awakening, level: 1 },
  { days: 14, name: MilestoneNameEnum.Balance, level: 2 },
  { days: 30, name: MilestoneNameEnum.Determination, level: 3 },
  { days: 60, name: MilestoneNameEnum.Enlightenment, level: 4 },
  { days: 90, name: MilestoneNameEnum.Freedom, level: 5 },
  { days: 180, name: MilestoneNameEnum.Mastery, level: 6 },
  { days: 365, name: MilestoneNameEnum.Resilience, level: 7 },
];

export async function checkMilestones(userId: string, soberDays: number) {
  for (const milestone of milestones) {
    if (soberDays === milestone.days) {
      // Criar um novo UserMilestone no banco de dados
      const newMilestone = await UserMilestoneModel.create({
        userId,
        name: milestone.name,
        level: milestone.level,
      });

      // Publicar o evento para as subscriptions
      pubsub.publish("MILESTONE_ACHIEVED", {
        milestoneAchieved: newMilestone,
      });

      console.log(`Milestone atingido: ${milestone.name} para o utilizador ${userId}`);
    }
  }
}

import { CreateUserMilestoneInputType } from "./inputs.js";

const userMilestoneTypeDefs = `#graphql

${CreateUserMilestoneInputType}

enum MilestoneNameEnum{
  Awakening
  Determination
  Resilience
  Balance
  Mastery
  Freedom
  Enlightenment
}


type UserMilestone {
    id: ID!
    userId: ID!
    name: String!
    level: Int!
    achievedDate: String!
}

  type Query {
  """
  Get all milestones of a user.

  Private (User role that is owner): Apenas o usuário dono pode acessar.
  """
  getUserMilestones(userId: ID!): [UserMilestone]
}

type Mutation {
  """
  Create a new user milestone.

  Private (User role that is owner): Apenas o usuário dono pode acessar.
  """
  createUserMilestone(input: CreateUserMilestoneInput!): UserMilestone!

  """
  Delete a user milestone.

  Private (User role that is owner): Apenas o usuário dono pode acessar.
  """
  deleteUserMilestone(id: ID!): String!

}

type Subscription {
  """
  Listen for milestone achievements of a user.

  Private (User role that is owner): Apenas o usuário dono pode acessar.
  """
  milestoneAchieved: UserMilestone!
}
`;

export default userMilestoneTypeDefs;
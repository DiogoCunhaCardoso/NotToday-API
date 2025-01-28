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
  userMilestones: [UserMilestone] @auth(roles: ["USER"])
}

type Mutation {
  """
  Create a new user milestone.

  Private (User role that is owner): Apenas o usuário dono pode acessar.
  """
  createUserMilestone(input: CreateUserMilestoneInput!): UserMilestone! @auth(roles: ["USER"])

  """
  Delete a user milestone.

  Private (Admin): Apenas o usuário dono pode acessar.
  """
  deleteUserMilestone(id: ID!): String! @auth(roles: ["ADMIN"])

}

type Subscription {
  """
  Listen for milestone achievements of a user.

  Private (User role that is owner): Apenas o usuário dono pode acessar.
  """
  milestoneAchieved: UserMilestone! @auth(roles: ["USER"]) 
}
`;

export default userMilestoneTypeDefs;

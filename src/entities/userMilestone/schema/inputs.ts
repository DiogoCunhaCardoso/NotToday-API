export const CreateUserMilestoneInputType = `#graphql
input CreateUserMilestoneInput {
    userId: ID!
    name: MilestoneNameEnum!
    level: Int!
  }
  `;
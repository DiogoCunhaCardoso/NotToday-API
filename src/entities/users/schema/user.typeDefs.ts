import {
  createUserInputType,
  setAddictionTypeInputType,
  loginInputType,
  loginResponseType,
  userOmittedType,
} from "./inputs.js";

const userTypeDefs = `#graphql

  # Input types
  ${createUserInputType}
  ${setAddictionTypeInputType}
  ${loginInputType}
  ${loginResponseType}
  ${userOmittedType}
  

  # USER MILESTONE (BADGES) ----------------------------------------------------

  type UserMilestone {
    id: ID!
    name: String!
    achievedDate: String!
  }

  # USER -----------------------------------------------------------------------

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    emailVerified: Boolean!
    addictions: [UserAddiction]
}


  type Query {
    # Gets a user by ID
    user(id: ID!): User!
    # Retrieves a list of all users
    users: [User]!
    totalUsers: Int!
  }

  type Mutation {
    # Creates a new user
    createUser(input: CreateUserInput!): UserOmittedFields!
    # Sets the addiction type for a user
    # setAddictionType(input: SetAddictionTypeInput!): User!
    # Logins user by generating a token
    login(input: LoginInput!): LoginResponse!
    # Increments days sober
    # incrementDaysSober(userId: ID!): User!
    # Resets Password
    resetPassword(userId: ID!, newPassword: String!): String!
    # Deletes a user
    deleteUser(id: ID!): String!
  }
`;

export default userTypeDefs;

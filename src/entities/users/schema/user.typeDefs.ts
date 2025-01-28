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


  enum UserRolesEnum {
    USER
    ADMIN
}
  

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
    role: UserRolesEnum!
}



type UsersPagination {
  users: [User]!
  totalUsers: Int!
}


  type Query {
    # Gets a user by ID
    user(id: ID!): User!  @auth(roles: ["ADMIN"])
    # Retrieves a list of all users
    users: [User]!  @auth(roles: ["ADMIN"])
    totalUsers: Int!  @auth(roles: ["ADMIN"])

    # Get a paginated list of users.
    # Access: Private (ADMIN role only).
    paginatedUsers(limit: Int!, offset: Int!): UsersPagination! @auth(roles: ["ADMIN"])
  }

  type Mutation {
    # Creates a new user
    createUser(input: CreateUserInput!): UserOmittedFields!  @auth(roles: ["USER", "ADMIN"])
    # Sets the addiction type for a user
    # setAddictionType(input: SetAddictionTypeInput!): User!
    # Logins user by generating a token
    login(input: LoginInput!): LoginResponse! @auth(roles: ["USER", "ADMIN"])
    # Increments days sober
    # incrementDaysSober(userId: ID!): User!
    # Resets Password
    resetPassword(userId: ID!, newPassword: String!): String! @auth(roles: ["USER", "ADMIN"])
    # Deletes a user
    deleteUser(id: ID!): String! @auth(roles: ["USER", "ADMIN"])
  }
`;

export default userTypeDefs;

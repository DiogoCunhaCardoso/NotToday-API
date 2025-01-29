import {
  createUserInputType,
  loginInputType,
  loginResponseType,
  userOmittedType,
} from "./inputs.js";

const userTypeDefs = `#graphql

  # Input types
  ${createUserInputType}
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
    # Gets loggedUser
    me: User!  @auth(roles: ["USER", "ADMIN"])
     # Gets number of all users
    usersCount: Int!  @auth(roles: ["USER", "ADMIN"])
    # Get a paginated list of users.
    # Access: Private (ADMIN role only).
    paginatedUsers(limit: Int!, offset: Int!): UsersPagination! @auth(roles: ["ADMIN"])
  }

  type Mutation {
    # Creates a new user
    createUser(input: CreateUserInput!): UserOmittedFields!
    # Logins user by generating a token
    login(input: LoginInput!): LoginResponse!
    # Increments days sober
    # incrementDaysSober(userId: ID!): User!
    # Resets Password
    resetPassword(newPassword: String!): String! @auth(roles: ["USER", "ADMIN"])
    # Deletes loggedInUserAccount
    deleteMe: String! @auth(roles: ["USER", "ADMIN"])
    # Deletes a user
    deleteUser(id: ID!): String! @auth(roles: ["ADMIN"])
  }
`;

export default userTypeDefs;

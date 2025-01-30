export const createUserInputType = `#graphql
  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }
`;

export const loginInputType = `#graphql
input LoginInput {
  email: String!
  password: String!
}
`;

export const loginResponseType = `#graphql
type LoginResponse {
  user: User!
  token: String!
}
`;

export const userOmittedType = `#graphql
type UserOmittedFields {
  _id: ID!
  name: String!
}

`;

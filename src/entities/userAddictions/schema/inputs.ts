export const addAddictionToUserInputType = `#graphql
  input AddAddictionToUserInput {
   userId: ID!
   addictionType: String!
  }
`;

export const removeAddictionFromUserInputType = `#graphql
  input RemoveAddictionFromUserInput {
   userId: ID!
   addictionType: String!
  }
`;


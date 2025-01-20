export const createDiaryInputType = `#graphql
  input CreateDiaryInput {
    userId: ID!
    title: String!
    content: String!
  }
`;

export const updateDiaryInputType = `#graphql
  input UpdateDiaryInput {
    id: ID!
    userId: ID!
    title: String
    content: String
  }
`;

export const deleteDiaryInputType = `#graphql
  input DeleteDiaryInput {
    id: ID!
    userId: ID!
  }
`;

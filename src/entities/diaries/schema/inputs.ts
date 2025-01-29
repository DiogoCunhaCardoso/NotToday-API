export const createDiaryInputType = `#graphql
  input CreateDiaryInput {
    title: String!
    content: String!
  }
`;

export const updateDiaryInputType = `#graphql
  input UpdateDiaryInput {
    id: ID!
    title: String
    content: String
  }
`;

export const deleteDiaryInputType = `#graphql
  input DeleteDiaryInput {
    id: ID!
  }
`;

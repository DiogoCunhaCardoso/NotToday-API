import {
  createDiaryInputType,
  updateDiaryInputType,
  deleteDiaryInputType,
} from "./inputs.js";

const diaryTypeDefs = `#graphql

${createDiaryInputType}
${updateDiaryInputType}
${deleteDiaryInputType}

  type Diary {
  id: ID!
  userId: ID!
  title: String!
  content: String!
  date: String!
}

  type Query {
    # Retrieves a list of all diaries from a user
    diaryEntries(userId: ID!): [Diary]!
  }

  type Mutation {
    #TODO
    # Creates a new diary
    createDiary(userId: ID!, input: CreateDiaryInput!): Diary!
    # Updates an diary
    updateDiary(input: UpdateDiaryInput!): Diary!       
    # Deletes an diary
    deleteDiary(id: ID!): String!       
  }
`;

export default diaryTypeDefs;

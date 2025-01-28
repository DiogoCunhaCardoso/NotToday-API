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
    # Retrieves a list of all diaries from authenticated user
    diaryEntries: [Diary]! @auth(roles: ["USER"])
  }

  type Mutation {
    # Creates a new diary
    createDiary(input: CreateDiaryInput!): Diary! @auth(roles: ["USER"])
    # Updates an diary
    updateDiary(input: UpdateDiaryInput!): Diary! @auth(roles: ["USER"])    
    # Deletes an diary
    deleteDiary(id: ID!): String! @auth(roles: ["USER"])
  }
`;

export default diaryTypeDefs;

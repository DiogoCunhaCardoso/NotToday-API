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
    diaryEntries(userId: ID!): [Diary]! @auth(roles: ["USER", "ADMIN"])
  }

  type Mutation {
    #TODO
    # Creates a new diary
    createDiary(userId: ID!, input: CreateDiaryInput!): Diary! @auth(roles: ["USER"])
    # Updates an diary
    updateDiary(input: UpdateDiaryInput!): Diary! @auth(roles: ["USER"])    
    # Deletes an diary
    deleteDiary(id: ID!): String! @auth(roles: ["USER"])   
  }
`;

export default diaryTypeDefs;

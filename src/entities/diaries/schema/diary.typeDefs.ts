import {
  createDiaryInputType,
  updateDiaryInputType,
  deleteDiaryInputType,
} from "./inputs";

const DiaryTypeDefs = `#graphql

${createDiaryInputType}
${updateDiaryInputType}
${deleteDiaryInputType}

  #TODO verifica se ta igual ao model
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
    createDiary(input: CreateDiaryInput!): Diary!       
    # Updates an diary
    updateDiary(input: UpdateDiaryInput!): Diary!       
    # Deletes an diary
    deleteDiary(type: DeleteDiaryInput!): String!       
  }
`;

export default DiaryTypeDefs;

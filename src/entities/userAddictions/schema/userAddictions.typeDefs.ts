import {
  addAddictionToUserInputType,
  removeAddictionFromUserInputType,
} from "./inputs.js";

const userAddictionTypeDefs = `#graphql

${addAddictionToUserInputType}
${removeAddictionFromUserInputType}


type UserAddiction {
  _id: ID!
  addiction: ID
  severity: SeverityEnum
  soberDays: Int
}


type Mutation {
    addAddictionToUser(input: AddAddictionToUserInput!): User @auth(roles: ["USER"])
    removeAddictionFromUser(input: RemoveAddictionFromUserInput!): User! @auth(roles: ["USER"])
}
`;

export default userAddictionTypeDefs;

import {
  addAddictionToUserInputType,
  IncrementDaysSoberInputType,
  removeAddictionFromUserInputType,

} from "./inputs.js";

const userAddictionTypeDefs = `#graphql

${addAddictionToUserInputType}
${IncrementDaysSoberInputType}
${removeAddictionFromUserInputType}


type UserAddiction {
  _id: ID!
  addiction: ID!
  userId: ID!
  severity: SeverityEnum
  soberDays: Int
}


type Mutation {

    addAddictionToUser(input: AddAddictionToUserInput!): UserAddiction @auth(roles: ["USER"])

    removeAddictionFromUser(input: RemoveAddictionFromUserInput!): [UserAddiction]! @auth(roles: ["USER"])

    # Increments days sober
    incrementDaysSober(input: IncrementDaysSoberInput!): UserAddiction!
}

type Subscription {
  newSoberDayNotification: String!
}
`;

export default userAddictionTypeDefs;

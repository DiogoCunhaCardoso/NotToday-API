import {
  createAddictionInputType,
  updateAddictionInputType,
  deleteAddictionInputType,
} from "./inputs.js";

const addictionTypeDefs = `#graphql

${createAddictionInputType}
${updateAddictionInputType}
${deleteAddictionInputType}

enum AddictionEnum {
  NONE
  ALCOHOL
  ATTENTION_SEEKING
  BAD_LANGUAGE
  CAFFEINE
  DAIRY
  DRUG
  FAST_FOOD
  GAMBLING
  NAIL_BITING
  PORN
  PROCRASTINATION
  SELF_HARM
  SMOKING
  SOCIAL_MEDIA
  SOFT_DRINKS
  SUGAR
  VAPING
}

enum SeverityEnum {
  LOW
  MODERATE
  HIGH
  CRITICAL
}


type Addiction {
  id: ID!
  type: AddictionEnum!
  symptoms: [String]!
  treatmentOptions: [String]!
  severity: SeverityEnum!
  triggers: [String]!
  copingMechanisms: [String]!
}

type Query {
  addiction(id: ID!): Addiction
  addictions: [Addiction]
}

type Mutation {
  createAddiction(input: CreateAddictionInput!): Addiction!
  updateAddiction(input: UpdateAddictionInput!): Addiction!
  deleteAddiction(input: DeleteAddictionInput!): String!
}
`;

export default addictionTypeDefs;

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
  description: String!
  symptoms: [String]!
  treatmentOptions: [String]!
  severity: SeverityEnum!
  triggers: [String]!
  copingMechanisms: [String]!
}

type Query {
  """
  Fetch a single addiction by its ID.

  Access: Public (Any User).
  """
  addiction(id: ID!): Addiction
  """
  Fetch all addictions.

  Access: Public (Any User).
  """
  addictions: [Addiction]
}

type Mutation {
  """
  Create a new addiction entry.

  Access: Private (ADMIN role only).
  """
  createAddiction(input: CreateAddictionInput!): Addiction!
  """
  Update an existing addiction entry.

  Access: Private (ADMIN role only).
  """
  updateAddiction(input: UpdateAddictionInput!): Addiction!
  """
  Delete an addiction entry by its ID.

  Access: Private (ADMIN role only).
  """
  deleteAddiction(input: DeleteAddictionInput!): String!
}
`;

export default addictionTypeDefs;

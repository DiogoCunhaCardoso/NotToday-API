export const createAddictionInputType = `#graphql
input CreateAddictionInput {
  type: AddictionEnum!
  symptoms: [String]!
  treatmentOptions: [String]!
  severity: SeverityEnum!
  triggers: [String]!
  copingMechanisms: [String]!
}
`;

export const updateAddictionInputType = `#graphql
input UpdateAddictionInput {
  id: ID!
  type: AddictionEnum
  description: String
  symptoms: [String]
  treatmentOptions: [String]
  severity: SeverityEnum
  triggers: [String]
  copingMechanisms: [String]
}
`;

export const deleteAddictionInputType = `#graphql
input DeleteAddictionInput {
  id: ID!
}
`;

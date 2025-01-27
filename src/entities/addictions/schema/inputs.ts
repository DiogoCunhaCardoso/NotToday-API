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
  _id: ID!
  type: AddictionEnum
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

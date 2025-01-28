const directiveTypeDefs = `#graphql
"""
Authorization directive to restrict access based on roles.
"""
directive @auth(roles: [UserRolesEnum]) on FIELD_DEFINITION
`;

export default directiveTypeDefs;
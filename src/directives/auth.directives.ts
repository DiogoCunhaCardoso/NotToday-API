import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql";
import { verifyToken } from "../utils/verifyToken.js"; // Assuming your token verification logic is here

export function authDirective(directiveName) {
  return {
    authDirectiveTypeDefs: `directive @${directiveName}(roles: [String!]) on FIELD_DEFINITION`,

    authDirectiveTransformer: (schema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
          const authDirective = getDirective(
            schema,
            fieldConfig,
            directiveName
          )?.[0];
          if (authDirective) {
            // Attach logic to enforce the authorization
            const { resolve = defaultFieldResolver } = fieldConfig;
            const { roles } = authDirective;

            fieldConfig.resolve = async function (...args) {
              const [, , context] = args; // Context is passed as the third argument
              const authHeader = context?.req?.headers?.authorization || ""; // Get Authorization header
              const token = authHeader.startsWith("Bearer ")
                ? authHeader.slice(7)
                : null;

              // Verify the token
              const user = verifyToken(token);

              if (!token) throw new Error("Authentication token is missing");
              if (!user) throw new Error("Invalid or expired token");

              if (roles && !roles.includes(user.role)) {
                throw new Error(
                  "You do not have permission to perform this action"
                );
              }

              context.user = user; // Attach user to context for resolver access

              return resolve.apply(this, args); // Call the original resolver
            };
            return fieldConfig;
          }
        },
      }),
  };
}

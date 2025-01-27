import { defaultFieldResolver } from "graphql";
const { SchemaDirectiveVisitor } = require('apollo-server');
import { GraphQLField } from "graphql";
import { verifyToken } from "../utils/verifyToken.js";


export class AuthDirective extends SchemaDirectiveVisitor {

  visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field;
    const { roles } = this.args; // Extract roles from the directive

    field.resolve = async function (...args: any[]) {
      const [, ,context] = args; // Context is the third argument
      const user = context.user; // Assume user is added to context after authentication

      if (!user) {
        throw new Error("Sem token. Faça login para continuar");
      }

      if (roles && !roles.includes(user.role)) {
        throw new Error("You do not have permission to perform this action");
      }

      return resolve.apply(this, args);
    };
  }
}


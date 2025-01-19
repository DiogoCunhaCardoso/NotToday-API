import { GraphQLResolveInfo } from "graphql";

// Modify the AsyncController to accept the correct types for GraphQL
type AsyncController = (
  parent: any,
  args: any,
  context: any,
  info: GraphQLResolveInfo
) => Promise<any>;

// Modify the `catchAsyncErrors` function to match GraphQL resolver structure
export const catchAsyncErrors = (controller: AsyncController) => {
  return async (
    parent: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo
  ) => {
    try {
      return await controller(parent, args, context, info);
    } catch (e: any) {
      throw new Error(`Error: ${e.message}`);
    }
  };
};

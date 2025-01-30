import { makeExecutableSchema } from "@graphql-tools/schema";
import userTypeDefs from "../entities/users/schema/user.typeDefs.js";
import userResolvers from "../entities/users/schema/user.resolvers.js";
import addictionTypeDefs from "../entities/addictions/schema/addiction.typeDefs.js";
import addictionResolvers from "../entities/addictions/schema/addiction.resolvers.js";
import diaryTypeDefs from "../entities/diaries/schema/diary.typeDefs.js";
import diaryResolvers from "../entities/diaries/schema/diary.resolvers.js";
import userAddictionTypeDefs from "../entities/userAddictions/schema/userAddictions.typeDefs.js";
import userAddictionResolvers from "../entities/userAddictions/schema/userAddictions.resolvers.js";
import userMilestoneTypeDefs from "../entities/userMilestone/schema/userMilestone.typeDefs.js";
import userMilestoneResolvers from "../entities/userMilestone/schema/userMilestone.resolvers.js";
import { authDirective } from "../directives/auth.directives.js";

// Define auth directive
const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective("auth");

// Consolidate typeDefs and resolvers
const typeDefs = [
  userTypeDefs,
  addictionTypeDefs,
  diaryTypeDefs,
  userAddictionTypeDefs,
  userMilestoneTypeDefs,
  authDirectiveTypeDefs,
];

const resolvers = [
  userResolvers,
  addictionResolvers,
  diaryResolvers,
  userAddictionResolvers,
  userMilestoneResolvers,
];

// Create and export the schema
let schema = makeExecutableSchema({ typeDefs, resolvers });

// Apply auth directive transformer
schema = authDirectiveTransformer(schema);

export default schema;

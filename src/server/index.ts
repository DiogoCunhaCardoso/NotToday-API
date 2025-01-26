import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import userTypeDefs from "../entities/users/schema/user.typeDefs.js";
import userResolvers from "../entities/users/schema/resolvers.js";
import addictionTypeDefs from "../entities/addictions/schema/addiction.typeDefs.js";
import addictionResolvers from "../entities/addictions/schema/addiction.resolvers.js";
import connectDB from "./db.js";
import diaryTypeDefs from "../entities/diaries/schema/diary.typeDefs.js";
import diaryResolvers from "../entities/diaries/schema/diary.resolvers.js";
import userAddictionTypeDefs from "../entities/userAddictions/schema/userAddictions.typeDefs.js";
import userAddictionResolvers from "../entities/userAddictions/schema/userAddictions.resolvers.js";
import userMilestoneTypeDefs from "../entities/userMilestone/schema/userMilestone.typeDefs.js";
import userMilestoneResolvers from "../entities/userMilestone/schema/userMilestone.resolvers.js";

connectDB();

const server = new ApolloServer({
  typeDefs: [userTypeDefs, addictionTypeDefs, diaryTypeDefs, userAddictionTypeDefs, userMilestoneTypeDefs],
  resolvers: [userResolvers, addictionResolvers, diaryResolvers, userAddictionResolvers, userMilestoneResolvers],
  introspection: true,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
};

startServer().catch((err) => {
  console.error("Error starting server:", err);
});

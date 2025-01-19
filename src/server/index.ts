import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import userTypeDefs from "../entities/users/schema/user.typeDefs.js";
import userResolvers from "../entities/users/schema/resolvers.js";
import addictionTypeDefs from "../entities/addictions/schema/addiction.typeDefs.js";
import addictionResolvers from "../entities/addictions/schema/addiction.resolvers.js";
import connectDB from "./db.js";

connectDB();

const server = new ApolloServer({
  typeDefs: [userTypeDefs, addictionTypeDefs],
  resolvers: [userResolvers, addictionResolvers],
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

// Import necessary packages
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { Express } from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { typeDefs } from './schemas';
import { resolvers } from './resolvers';

// Initialize environment variables
dotenv.config();

// Define TypeScript interface for Apollo Server context
interface MyContext {
  token?: string;
}

// Access environment variables with default values
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB connection function
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", (error as Error).message);
    process.exit(1); // Exit process with failure code
  }
};

// Function to initialize the Apollo Server
const startApolloServer = async () => {
  await connectDB(); // Connect to the database before starting the server

  const app: Express = express();
  const httpServer = http.createServer(app);

  // Initialize Apollo Server with type definitions, resolvers, and plugins
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Start the Apollo Server
  await server.start();

  // Apply middleware to handle requests to the '/graphql' endpoint
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.token as string, // Type cast the token for context
      }),
    })
  );

  // Start the HTTP server and log the GraphQL endpoint URL
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server is running at http://localhost:${PORT}/graphql`);
};

// Start the server
startApolloServer().catch((error) => {
  console.error("❌ Error starting the server:", error);
});

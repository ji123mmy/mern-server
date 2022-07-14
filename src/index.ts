import express, { urlencoded, json } from "express";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import typeDefs from "./schema/typeDefs";
import resolvers from "./schema/resolvers";

dotenv.config();

mongoose
  .connect(process.env.DB_URI as string)
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
});
const serverCleanup = useServer({ schema }, wsServer);

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

async function startServer() {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
}

startServer();

httpServer.listen(8080, () => {
  console.log("server started at http://localhost:8080/graphql");
});

import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import { User } from "./user";
import {Tweet} from './tweet'
import { graphQlContext } from "../interfaces";
import JwtService from "./services/JsonTokenService";

export async function serverInit() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  require("dotenv").config();
  const server = new ApolloServer<graphQlContext>({
    typeDefs: `
        ${User.types}
        ${Tweet.types}
        type Query{
          ${User.queries}
          ${Tweet.queries}
        }
        type Mutation{
          ${Tweet.mutations}
        }

        `,
    resolvers: {
      Query: {
        ...User.resolvers.resolverQuery,
        ...Tweet.resolvers.queries  
      },
      Mutation:{
        ...Tweet.resolvers.mutations
      },
      ...Tweet.resolvers.extraResolver,
      ...User.resolvers.extraResolver
    },
  });
  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return {
          user: req.headers.authorization
            ? JwtService.decodeToken(req.headers.authorization.split('Bearer ')[1])
            : undefined,
        };    
      },
    })
  );
  return app;
}

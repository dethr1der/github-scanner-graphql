import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { config } from './config/app-config';
import { GitHubAPI } from '../dataSources/repository/github.datasource';
import {Context} from "./interfaces/context.interface";
import typeDefs from "../graphql/index";
import {resolvers} from '../resolvers';
export const bootstrap = async () => {
    const app = express();
    const httpServer = http.createServer(app);

    const githubAPI = new GitHubAPI({token: config.TOKEN});

    const server = new ApolloServer<Context>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(server, {
            context: async ({req}) => ({
                dataSources: {
                    githubAPI,
                },
            }),
        })
    );

    await new Promise<void>((resolve) => httpServer.listen({ port: config.PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${config.PORT}/graphql`);
};

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import Express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ComplexityLimitRule, DepthLimitRule } from '../graphql/rules';
import { NexusGraphQLSchema } from 'nexus/dist/core';
import http from 'http';

import { schema } from '../graphql/schema';
import { Context, context } from '../graphql/context';
import { consoleText } from '../lib/definitions';

import HeaderRoutes from '../routes/headers';
import ErrorRoutes from '../routes/errors';
import AuthRoutes from '../modules/auth/routes';
import UserRoutes from '../modules/user/routes';

const { DEV_PORT, PORT } = process.env;

async function startApolloServer(schema: NexusGraphQLSchema, context: Context) {
  const app = Express();
  const httpServer = http.createServer(app);
  const SERVER_PORT: string = (PORT as string) || (DEV_PORT as string);
  const server = new ApolloServer({
    schema: schema,
    context: ({ req }) => {
      const token: string = req.headers.authorization || '';

      //if (!token) throw new AuthenticationError('Unauthorized user');

      return {
        ...context,
      };
    },
    validationRules: [ComplexityLimitRule, DepthLimitRule],
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  server.applyMiddleware({ app });

  // Parsers --------------------
  app.use(Express.urlencoded({ extended: false }));
  app.use(Express.json());

  // Routes ----------------------
  app.use(HeaderRoutes);
  app.use('/auth', AuthRoutes);
  app.use('/admin/user/', UserRoutes);
  app.use(ErrorRoutes);

  await new Promise((resolve: any) =>
    httpServer.listen({ port: SERVER_PORT }, resolve),
  );

  console.log(
    consoleText.magenta,
    `\
    🚀 Server listening on port ${SERVER_PORT}
      `,
  );
}

startApolloServer(schema, context);

import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';

import { makeContext } from './context';
import { schema } from './schema/schema';


export function makeServer(db: PrismaClient): ApolloServer {

  // Create GraphQL Server
  const server = new ApolloServer({
    schema,
    context: () => makeContext(db)
  });

  return server;
}

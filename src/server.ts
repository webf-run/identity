import { ApolloServer } from 'apollo-server';
import type { Context } from './context';
import { schema } from './schema/schema';

export function makeServer(context: Context): ApolloServer {
  return new ApolloServer({ schema, context });
}

import { initialize } from './DBClient';
import { makeServer } from './server/server';


export async function main() {

  // Initialize the Database client
  const db = initialize();

  // Initialize a GraphQL Server with fastify client
  const server = await makeServer(db);

  const info = await server.listen();

  console.log(`🚀 Server ready at ${info.url}`);
}


main().then(() => {});

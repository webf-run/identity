import { makeServer } from './server';
import { initializeClient } from './client';
import { makeContext } from './context';


export async function main() {

  // Initialize the Database client
  const client = initializeClient();

  const context = makeContext(client);
  const server = makeServer(context);
  const info = await server.listen();

  console.log(`🚀 Server ready at ${info.url}`);
}

main().then(() => {});

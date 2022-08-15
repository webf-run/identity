import { makeCache } from './cache';
import { initialize } from './DBClient';
import { makeServer } from './server/Server';


export async function main() {

  const PG_HOST = process.env.PG_HOST;
  const PG_PORT = Number(process.env.PG_PORT);
  const PG_USER = process.env.PG_USER;
  const PG_PASSWORD = process.env.PG_PASSWORD;
  const PG_DATABASE = process.env.PG_DATABASE;

  // Initialize the Database client
  const db = await initialize({
    host: PG_HOST,
    port: PG_PORT,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE
  });
  makeCache();

  // Initialize a GraphQL Server with fastify client
  const server = await makeServer(db);

  const info = await server.listen();

  console.log(`🚀 Server ready at ${info.url}`);
}


main().then(() => {});

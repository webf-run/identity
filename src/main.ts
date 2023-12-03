import { serve } from '@hono/node-server';
import { Hono } from 'hono';

export async function main() {
  const app = new Hono();

  app.get('/', (c) => c.text('Hello Hono!'));

  app.use('*', async (c, next) => {
    await next();
  });

  serve({
    fetch: app.fetch,
    port: 4001,
  }, (info) => {
    console.log(`🚀 Server ready at ${info.address}:${info.port}`);
  });
}

main().then(() => {});

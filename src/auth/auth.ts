import { Hono } from 'hono';

export function auth() {
  const auth = new Hono();

  auth.get('/auth/login', (c) => {



    return c.text('Hello Hono!');
  });
}

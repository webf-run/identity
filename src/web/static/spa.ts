import { serveStatic } from '@hono/node-server/serve-static';

export type SPAOptions = {
  path: string;
};

export function spaMiddleware(options: SPAOptions) {
}

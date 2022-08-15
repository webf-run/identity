import { ConnectionConfig, Pool } from 'pg';
import {
  DbConnection,
  DbContext,
  GeneratedQuery,
  Repository,
  Transaction
} from '../domain/DbContext';

import * as app from './app';
import * as asset from './asset';
import * as client from './client';
import * as invitation from './invitation';
import * as post from './post';
import * as publication from './publication';
import * as quota from './quota';
import * as tag from './tag';
import * as token from './token';
import * as user from './user';

function makeRepository<S extends GeneratedQuery>(statements: S, conn: DbConnection): Repository<S> {
  const proxy: any = new Proxy(statements, {
    get: (target, prop: string, _receiver) => {
      return (parameter: any) => {
        return target[prop].run(parameter, conn);
      };
    }
  });

  return proxy;
}


export class DbContextImpl implements DbContext {

  // Interface implementation
  app: Repository<typeof app>;
  asset: Repository<typeof asset>;
  client: Repository<typeof client>;
  invitation: Repository<typeof invitation>;
  post: Repository<typeof post>;
  publication: Repository<typeof publication>;
  quota: Repository<typeof quota>;
  tag: Repository<typeof tag>;
  token: Repository<typeof token>;
  user: Repository<typeof user>;

  constructor(conn: DbConnection) {
    // Rewrite the handler functions
    this.app = makeRepository(app, conn);
    this.asset = makeRepository(asset, conn);
    this.client = makeRepository(client, conn);
    this.invitation = makeRepository(invitation, conn);
    this.post = makeRepository(post, conn);
    this.publication = makeRepository(publication, conn);
    this.quota = makeRepository(quota, conn);
    this.tag = makeRepository(tag, conn);
    this.token = makeRepository(token, conn);
    this.user = makeRepository(user, conn);
  }
}


export class DbClientImpl extends DbContextImpl {

  // Pool is the pooled connection
  #pool: Pool;

  constructor(config: ConnectionConfig) {
    const pool = new Pool(config);
    super(pool);

    this.#pool = pool;
  }

  async transaction<T>(callback: Transaction<T>): Promise<T> {
    const client = await this.#pool.connect();
    const dbContext = new DbContextImpl(client);

    try {
      await client.query('BEGIN');

      try {
        const results = await callback(dbContext);
        client.query('COMMIT');

        return results;
      } catch (err) {
        client.query('ROLLBACK');

        throw err;
      }
    } finally {
      client.release();
    }
  }
}

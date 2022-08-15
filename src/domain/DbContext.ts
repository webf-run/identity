import { PreparedQuery } from '@pgtyped/query';

import type * as app from '../db/app';
import type * as asset from '../db/asset';
import type * as client from '../db/client';
import type * as invitation from '../db/invitation';
import type * as post from '../db/post';
import type * as publication from '../db/publication';
import type * as quota from '../db/quota';
import type * as tag from '../db/tag';
import type * as token from '../db/token';
import type * as user from '../db/user';


export interface DbConnection {
  query: (query: string, bindings: any[]) => Promise<{ rows: any[]; }>;
}

export type GeneratedQuery = { [key: string]: PreparedQuery<any, any> };
export type ExtractParameter<P> = P extends PreparedQuery<infer X, infer Y> ? X : never;
export type ExtractResult<P> = P extends PreparedQuery<infer X, infer Y> ? Y : never;

export type Repository<Statements> = {
  [PQ in (keyof Statements)]: (param: ExtractParameter<Statements[PQ]>) => Promise<ExtractResult<Statements[PQ]>[]>;
};

export interface DbContext {
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
}

export type Transaction<T> = (repo: DbContext) => T | Promise<T>;

export interface DbClient extends DbContext {
  transaction: <T>(transactionFn: Transaction<T>) => Promise<T>;
}

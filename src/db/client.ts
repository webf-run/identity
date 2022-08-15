/** Types generated for queries found in "src/db/client.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetById' parameters type */
export interface IGetByIdParams {
  id: string;
}

/** 'GetById' return type */
export interface IGetByIdResult {
  createdAt: Date;
  description: string;
  hashFn: string;
  id: string;
  secret: string;
  updatedAt: Date;
}

/** 'GetById' query type */
export interface IGetByIdQuery {
  params: IGetByIdParams;
  result: IGetByIdResult;
}

const getByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":105,"b":108}]}],"statement":"SELECT\n  id,\n  description,\n  secret,\n  hash_fn,\n  created_at,\n  updated_at\nFROM\n  client_app\nWHERE id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   description,
 *   secret,
 *   hash_fn,
 *   created_at,
 *   updated_at
 * FROM
 *   client_app
 * WHERE id = :id!
 * ```
 */
export const getById = new PreparedQuery<IGetByIdParams,IGetByIdResult>(getByIdIR);


/** 'GetTotalCount' parameters type */
export type IGetTotalCountParams = void;

/** 'GetTotalCount' return type */
export interface IGetTotalCountResult {
  count: number | null;
}

/** 'GetTotalCount' query type */
export interface IGetTotalCountQuery {
  params: IGetTotalCountParams;
  result: IGetTotalCountResult;
}

const getTotalCountIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  count(*) :: int\nFROM\n  client_app"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   count(*) :: int
 * FROM
 *   client_app
 * ```
 */
export const getTotalCount = new PreparedQuery<IGetTotalCountParams,IGetTotalCountResult>(getTotalCountIR);


/** 'CreateClientApp' parameters type */
export interface ICreateClientAppParams {
  createdAt: Date;
  description: string;
  hashFn: string;
  id: string;
  secret: string;
  updatedAt: Date;
}

/** 'CreateClientApp' return type */
export interface ICreateClientAppResult {
  createdAt: Date;
  description: string;
  hashFn: string;
  id: string;
  secret: string;
  updatedAt: Date;
}

/** 'CreateClientApp' query type */
export interface ICreateClientAppQuery {
  params: ICreateClientAppParams;
  result: ICreateClientAppResult;
}

const createClientAppIR: any = {"usedParamSet":{"id":true,"description":true,"secret":true,"hashFn":true,"createdAt":true,"updatedAt":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":127,"b":130}]},{"name":"description","required":true,"transform":{"type":"scalar"},"locs":[{"a":137,"b":149}]},{"name":"secret","required":true,"transform":{"type":"scalar"},"locs":[{"a":156,"b":163}]},{"name":"hashFn","required":true,"transform":{"type":"scalar"},"locs":[{"a":170,"b":177}]},{"name":"createdAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":184,"b":194}]},{"name":"updatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":201,"b":211}]}],"statement":"INSERT INTO\n  client_app (\n    id,\n    description,\n    secret,\n    hash_fn,\n    created_at,\n    updated_at\n  )\nVALUES\n  (\n    :id!,\n    :description!,\n    :secret!,\n    :hashFn!,\n    :createdAt!,\n    :updatedAt!\n  ) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   client_app (
 *     id,
 *     description,
 *     secret,
 *     hash_fn,
 *     created_at,
 *     updated_at
 *   )
 * VALUES
 *   (
 *     :id!,
 *     :description!,
 *     :secret!,
 *     :hashFn!,
 *     :createdAt!,
 *     :updatedAt!
 *   ) RETURNING *
 * ```
 */
export const createClientApp = new PreparedQuery<ICreateClientAppParams,ICreateClientAppResult>(createClientAppIR);



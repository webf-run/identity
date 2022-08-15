/** Types generated for queries found in "src/db/token.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'FindClientAppByToken' parameters type */
export interface IFindClientAppByTokenParams {
  tokenId: string;
}

/** 'FindClientAppByToken' return type */
export interface IFindClientAppByTokenResult {
  createdAt: Date;
  description: string;
  duration: number;
  generatedAt: Date;
  hashFn: string;
  id: string;
  secret: string;
  token: string;
  updatedAt: Date;
}

/** 'FindClientAppByToken' query type */
export interface IFindClientAppByTokenQuery {
  params: IFindClientAppByTokenParams;
  result: IFindClientAppByTokenResult;
}

const findClientAppByTokenIR: any = {"usedParamSet":{"tokenId":true},"params":[{"name":"tokenId","required":true,"transform":{"type":"scalar"},"locs":[{"a":324,"b":333}]}],"statement":"SELECT\n  client_app_token.id as token,\n  duration,\n  generated_at,\n  client_app.id,\n  client_app.description,\n  client_app.secret,\n  client_app.hash_fn,\n  client_app.created_at,\n  client_app.updated_at\nFROM\n  client_app_token\n  INNER JOIN client_app ON client_app_token.client_app_id = client_app.id\nWHERE\n  client_app.id = :tokenId !"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   client_app_token.id as token,
 *   duration,
 *   generated_at,
 *   client_app.id,
 *   client_app.description,
 *   client_app.secret,
 *   client_app.hash_fn,
 *   client_app.created_at,
 *   client_app.updated_at
 * FROM
 *   client_app_token
 *   INNER JOIN client_app ON client_app_token.client_app_id = client_app.id
 * WHERE
 *   client_app.id = :tokenId !
 * ```
 */
export const findClientAppByToken = new PreparedQuery<IFindClientAppByTokenParams,IFindClientAppByTokenResult>(findClientAppByTokenIR);


/** 'CreateUserToken' parameters type */
export interface ICreateUserTokenParams {
  duration: number;
  generatedAt: Date;
  id: string;
  userId: string;
}

/** 'CreateUserToken' return type */
export interface ICreateUserTokenResult {
  duration: number;
  generatedAt: Date;
  id: string;
  userId: string;
}

/** 'CreateUserToken' query type */
export interface ICreateUserTokenQuery {
  params: ICreateUserTokenParams;
  result: ICreateUserTokenResult;
}

const createUserTokenIR: any = {"usedParamSet":{"id":true,"generatedAt":true,"duration":true,"userId":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":98,"b":101}]},{"name":"generatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":108,"b":120}]},{"name":"duration","required":true,"transform":{"type":"scalar"},"locs":[{"a":127,"b":136}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":143,"b":150}]}],"statement":"INSERT INTO\n  user_token (\n    id,\n    generated_at,\n    duration,\n    user_id\n  )\nVALUES\n  (\n    :id!,\n    :generatedAt!,\n    :duration!,\n    :userId!\n  )\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   user_token (
 *     id,
 *     generated_at,
 *     duration,
 *     user_id
 *   )
 * VALUES
 *   (
 *     :id!,
 *     :generatedAt!,
 *     :duration!,
 *     :userId!
 *   )
 * RETURNING *
 * ```
 */
export const createUserToken = new PreparedQuery<ICreateUserTokenParams,ICreateUserTokenResult>(createUserTokenIR);


/** 'CreateClientAppToken' parameters type */
export interface ICreateClientAppTokenParams {
  clientAppId: string;
  duration: number;
  generatedAt: Date;
  id: string;
}

/** 'CreateClientAppToken' return type */
export interface ICreateClientAppTokenResult {
  clientAppId: string;
  duration: number;
  generatedAt: Date;
  id: string;
}

/** 'CreateClientAppToken' query type */
export interface ICreateClientAppTokenQuery {
  params: ICreateClientAppTokenParams;
  result: ICreateClientAppTokenResult;
}

const createClientAppTokenIR: any = {"usedParamSet":{"id":true,"generatedAt":true,"duration":true,"clientAppId":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":110,"b":113}]},{"name":"generatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":120,"b":132}]},{"name":"duration","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":148}]},{"name":"clientAppId","required":true,"transform":{"type":"scalar"},"locs":[{"a":155,"b":167}]}],"statement":"INSERT INTO\n  client_app_token (\n    id,\n    generated_at,\n    duration,\n    client_app_id\n  )\nVALUES\n  (\n    :id!,\n    :generatedAt!,\n    :duration!,\n    :clientAppId!\n  )\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   client_app_token (
 *     id,
 *     generated_at,
 *     duration,
 *     client_app_id
 *   )
 * VALUES
 *   (
 *     :id!,
 *     :generatedAt!,
 *     :duration!,
 *     :clientAppId!
 *   )
 * RETURNING *
 * ```
 */
export const createClientAppToken = new PreparedQuery<ICreateClientAppTokenParams,ICreateClientAppTokenResult>(createClientAppTokenIR);


/** 'CreateResetPasswordRequest' parameters type */
export interface ICreateResetPasswordRequestParams {
  code: string;
  createdAt: Date;
  id: string;
  updatedAt: Date;
  userId: string;
}

/** 'CreateResetPasswordRequest' return type */
export interface ICreateResetPasswordRequestResult {
  code: string;
  createdAt: Date;
  id: string;
  updatedAt: Date;
  userId: string;
}

/** 'CreateResetPasswordRequest' query type */
export interface ICreateResetPasswordRequestQuery {
  params: ICreateResetPasswordRequestParams;
  result: ICreateResetPasswordRequestResult;
}

const createResetPasswordRequestIR: any = {"usedParamSet":{"id":true,"code":true,"userId":true,"createdAt":true,"updatedAt":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":120,"b":123}]},{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":130,"b":135}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":142,"b":149}]},{"name":"createdAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":156,"b":166}]},{"name":"updatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":173,"b":183}]}],"statement":"INSERT INTO\n  reset_password_request (\n    id,\n    code,\n    user_id,\n    created_at,\n    updated_at\n  )\nVALUES\n  (\n    :id!,\n    :code!,\n    :userId!,\n    :createdAt!,\n    :updatedAt!\n  ) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   reset_password_request (
 *     id,
 *     code,
 *     user_id,
 *     created_at,
 *     updated_at
 *   )
 * VALUES
 *   (
 *     :id!,
 *     :code!,
 *     :userId!,
 *     :createdAt!,
 *     :updatedAt!
 *   ) RETURNING *
 * ```
 */
export const createResetPasswordRequest = new PreparedQuery<ICreateResetPasswordRequestParams,ICreateResetPasswordRequestResult>(createResetPasswordRequestIR);


/** 'FindResetPasswordRequestByEmail' parameters type */
export interface IFindResetPasswordRequestByEmailParams {
  email: string;
}

/** 'FindResetPasswordRequestByEmail' return type */
export interface IFindResetPasswordRequestByEmailResult {
  count: number;
  userId: string;
}

/** 'FindResetPasswordRequestByEmail' query type */
export interface IFindResetPasswordRequestByEmailQuery {
  params: IFindResetPasswordRequestByEmailParams;
  result: IFindResetPasswordRequestByEmailResult;
}

const findResetPasswordRequestByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":182,"b":188}]}],"statement":"SELECT\n  app_user.id as \"user_id\",\n  count(rpq.id) :: int AS \"count!\"\nFROM\n  app_user\n  LEFT JOIN reset_password_request AS rpq ON app_user.id = rpq.user_id\nWHERE\n  app_user.email = :email!\nGROUP BY\n  app_user.id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   app_user.id as "user_id",
 *   count(rpq.id) :: int AS "count!"
 * FROM
 *   app_user
 *   LEFT JOIN reset_password_request AS rpq ON app_user.id = rpq.user_id
 * WHERE
 *   app_user.email = :email!
 * GROUP BY
 *   app_user.id
 * ```
 */
export const findResetPasswordRequestByEmail = new PreparedQuery<IFindResetPasswordRequestByEmailParams,IFindResetPasswordRequestByEmailResult>(findResetPasswordRequestByEmailIR);


/** 'FindResetPasswordRequestByCode' parameters type */
export interface IFindResetPasswordRequestByCodeParams {
  code: string;
  validTime: Date;
}

/** 'FindResetPasswordRequestByCode' return type */
export interface IFindResetPasswordRequestByCodeResult {
  code: string;
  createdAt: Date;
  id: string;
  updatedAt: Date;
  userId: string;
}

/** 'FindResetPasswordRequestByCode' query type */
export interface IFindResetPasswordRequestByCodeQuery {
  params: IFindResetPasswordRequestByCodeParams;
  result: IFindResetPasswordRequestByCodeResult;
}

const findResetPasswordRequestByCodeIR: any = {"usedParamSet":{"code":true,"validTime":true},"params":[{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":104,"b":109}]},{"name":"validTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":131,"b":141}]}],"statement":"SELECT\n  id,\n  code,\n  user_id,\n  created_at,\n  updated_at\nFROM\n  reset_password_request\nWHERE\n  code = :code!\n  AND updated_at >= :validTime!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   code,
 *   user_id,
 *   created_at,
 *   updated_at
 * FROM
 *   reset_password_request
 * WHERE
 *   code = :code!
 *   AND updated_at >= :validTime!
 * ```
 */
export const findResetPasswordRequestByCode = new PreparedQuery<IFindResetPasswordRequestByCodeParams,IFindResetPasswordRequestByCodeResult>(findResetPasswordRequestByCodeIR);


/** 'DeleteResetPasswordRequest' parameters type */
export interface IDeleteResetPasswordRequestParams {
  id: string;
}

/** 'DeleteResetPasswordRequest' return type */
export type IDeleteResetPasswordRequestResult = void;

/** 'DeleteResetPasswordRequest' query type */
export interface IDeleteResetPasswordRequestQuery {
  params: IDeleteResetPasswordRequestParams;
  result: IDeleteResetPasswordRequestResult;
}

const deleteResetPasswordRequestIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":50,"b":53}]}],"statement":"DELETE FROM\n  reset_password_request\nWHERE\n  id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM
 *   reset_password_request
 * WHERE
 *   id = :id!
 * ```
 */
export const deleteResetPasswordRequest = new PreparedQuery<IDeleteResetPasswordRequestParams,IDeleteResetPasswordRequestResult>(deleteResetPasswordRequestIR);



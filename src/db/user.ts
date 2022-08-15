/** Types generated for queries found in "src/db/user.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetByEmail' parameters type */
export interface IGetByEmailParams {
  email: string;
}

/** 'GetByEmail' return type */
export interface IGetByEmailResult {
  createdAt: Date;
  email: string;
  firstName: string;
  hashFn: string;
  id: string;
  lastName: string;
  password: string;
  updatedAt: Date;
}

/** 'GetByEmail' query type */
export interface IGetByEmailQuery {
  params: IGetByEmailParams;
  result: IGetByEmailResult;
}

const getByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":131,"b":137}]}],"statement":"SELECT\n  id,\n  first_name,\n  last_name,\n  email,\n  password,\n  hash_fn,\n  created_at,\n  updated_at\nFROM\n  app_user\nWHERE\n  email = :email!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   first_name,
 *   last_name,
 *   email,
 *   password,
 *   hash_fn,
 *   created_at,
 *   updated_at
 * FROM
 *   app_user
 * WHERE
 *   email = :email!
 * ```
 */
export const getByEmail = new PreparedQuery<IGetByEmailParams,IGetByEmailResult>(getByEmailIR);


/** 'UpdatePassword' parameters type */
export interface IUpdatePasswordParams {
  hashFn: string;
  id: string;
  password: string;
}

/** 'UpdatePassword' return type */
export interface IUpdatePasswordResult {
  createdAt: Date;
  email: string;
  firstName: string;
  hashFn: string;
  id: string;
  lastName: string;
  password: string;
  updatedAt: Date;
}

/** 'UpdatePassword' query type */
export interface IUpdatePasswordQuery {
  params: IUpdatePasswordParams;
  result: IUpdatePasswordResult;
}

const updatePasswordIR: any = {"usedParamSet":{"password":true,"hashFn":true,"id":true},"params":[{"name":"password","required":true,"transform":{"type":"scalar"},"locs":[{"a":35,"b":44}]},{"name":"hashFn","required":true,"transform":{"type":"scalar"},"locs":[{"a":59,"b":66}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":81,"b":84}]}],"statement":"UPDATE\n  app_user\nSET\n  password = :password!,\n  hash_fn = :hashFn!\nWHERE\n  id = :id!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE
 *   app_user
 * SET
 *   password = :password!,
 *   hash_fn = :hashFn!
 * WHERE
 *   id = :id!
 * RETURNING *
 * ```
 */
export const updatePassword = new PreparedQuery<IUpdatePasswordParams,IUpdatePasswordResult>(updatePasswordIR);


/** 'GetByToken' parameters type */
export interface IGetByTokenParams {
  tokenId: string;
}

/** 'GetByToken' return type */
export interface IGetByTokenResult {
  createdAt: Date;
  duration: number;
  email: string;
  firstName: string;
  fromEmail: string;
  generatedAt: Date;
  lastName: string;
  publicationId: string;
  publicUrl: string;
  roleId: number;
  tenantId: string;
  tokenId: string;
  updatedAt: Date;
  userId: string;
}

/** 'GetByToken' query type */
export interface IGetByTokenQuery {
  params: IGetByTokenParams;
  result: IGetByTokenResult;
}

const getByTokenIR: any = {"usedParamSet":{"tokenId":true},"params":[{"name":"tokenId","required":true,"transform":{"type":"scalar"},"locs":[{"a":707,"b":715}]}],"statement":"SELECT\n  token.id as \"token_id\",\n  token.generated_at,\n  token.duration,\n  app_user.id as \"user_id\",\n  app_user.first_name as \"first_name\",\n  app_user.last_name as \"last_name\",\n  app_user.email as \"email\",\n  app_user.created_at as \"created_at\",\n  app_user.updated_at as \"updated_at\",\n  user_publication_role.role_id,\n  user_publication_role.publication_id,\n  publication.from_email,\n  publication.public_url,\n  publication.tenant_id\nFROM\n  user_token token\n  INNER JOIN app_user\n    ON token.user_id = app_user.id\n  INNER JOIN user_publication_role\n    ON token.user_id = user_publication_role.user_id\n  INNER JOIN publication\n    ON user_publication_role.publication_id = publication.id\nWHERE\n  token.id = :tokenId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   token.id as "token_id",
 *   token.generated_at,
 *   token.duration,
 *   app_user.id as "user_id",
 *   app_user.first_name as "first_name",
 *   app_user.last_name as "last_name",
 *   app_user.email as "email",
 *   app_user.created_at as "created_at",
 *   app_user.updated_at as "updated_at",
 *   user_publication_role.role_id,
 *   user_publication_role.publication_id,
 *   publication.from_email,
 *   publication.public_url,
 *   publication.tenant_id
 * FROM
 *   user_token token
 *   INNER JOIN app_user
 *     ON token.user_id = app_user.id
 *   INNER JOIN user_publication_role
 *     ON token.user_id = user_publication_role.user_id
 *   INNER JOIN publication
 *     ON user_publication_role.publication_id = publication.id
 * WHERE
 *   token.id = :tokenId!
 * ```
 */
export const getByToken = new PreparedQuery<IGetByTokenParams,IGetByTokenResult>(getByTokenIR);


/** 'CreateNewUser' parameters type */
export interface ICreateNewUserParams {
  createdAt: Date;
  email: string;
  firstName: string;
  hashFn: string;
  id: string;
  lastName: string;
  password: string;
  updatedAt: Date;
}

/** 'CreateNewUser' return type */
export interface ICreateNewUserResult {
  createdAt: Date;
  email: string;
  firstName: string;
  hashFn: string;
  id: string;
  lastName: string;
  password: string;
  updatedAt: Date;
}

/** 'CreateNewUser' query type */
export interface ICreateNewUserQuery {
  params: ICreateNewUserParams;
  result: ICreateNewUserResult;
}

const createNewUserIR: any = {"usedParamSet":{"id":true,"firstName":true,"lastName":true,"email":true,"password":true,"hashFn":true,"createdAt":true,"updatedAt":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":148,"b":151}]},{"name":"firstName","required":true,"transform":{"type":"scalar"},"locs":[{"a":156,"b":166}]},{"name":"lastName","required":true,"transform":{"type":"scalar"},"locs":[{"a":171,"b":180}]},{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":185,"b":191}]},{"name":"password","required":true,"transform":{"type":"scalar"},"locs":[{"a":196,"b":205}]},{"name":"hashFn","required":true,"transform":{"type":"scalar"},"locs":[{"a":210,"b":217}]},{"name":"createdAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":222,"b":232}]},{"name":"updatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":237,"b":247}]}],"statement":"INSERT INTO\n  app_user (\n    id,\n    first_name,\n    last_name,\n    email,\n    password,\n    hash_fn,\n    created_at,\n    updated_at\n  )\nVALUES (\n  :id!,\n  :firstName!,\n  :lastName!,\n  :email!,\n  :password!,\n  :hashFn!,\n  :createdAt!,\n  :updatedAt!\n) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   app_user (
 *     id,
 *     first_name,
 *     last_name,
 *     email,
 *     password,
 *     hash_fn,
 *     created_at,
 *     updated_at
 *   )
 * VALUES (
 *   :id!,
 *   :firstName!,
 *   :lastName!,
 *   :email!,
 *   :password!,
 *   :hashFn!,
 *   :createdAt!,
 *   :updatedAt!
 * ) RETURNING *
 * ```
 */
export const createNewUser = new PreparedQuery<ICreateNewUserParams,ICreateNewUserResult>(createNewUserIR);



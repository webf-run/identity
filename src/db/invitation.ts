/** Types generated for queries found in "src/db/invitation.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetById' parameters type */
export interface IGetByIdParams {
  invitationId: string;
}

/** 'GetById' return type */
export interface IGetByIdResult {
  code: string;
  createdAt: Date;
  duration: number;
  email: string;
  expiryAt: Date;
  firstName: string;
  id: string;
  lastName: string;
  publicationId: string;
  roleId: number;
  updatedAt: Date;
}

/** 'GetById' query type */
export interface IGetByIdQuery {
  params: IGetByIdParams;
  result: IGetByIdResult;
}

const getByIdIR: any = {"usedParamSet":{"invitationId":true},"params":[{"name":"invitationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":169,"b":182}]}],"statement":"SELECT\n  id,\n  code,\n  first_name,\n  last_name,\n  email,\n  duration,\n  expiry_at,\n  publication_id,\n  role_id,\n  created_at,\n  updated_at\nFROM\n  invitation\nWHERE\n  id = :invitationId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   code,
 *   first_name,
 *   last_name,
 *   email,
 *   duration,
 *   expiry_at,
 *   publication_id,
 *   role_id,
 *   created_at,
 *   updated_at
 * FROM
 *   invitation
 * WHERE
 *   id = :invitationId!
 * ```
 */
export const getById = new PreparedQuery<IGetByIdParams,IGetByIdResult>(getByIdIR);


/** 'FindByCode' parameters type */
export interface IFindByCodeParams {
  code: string;
  expiryAt: Date;
}

/** 'FindByCode' return type */
export interface IFindByCodeResult {
  code: string;
  createdAt: Date;
  duration: number;
  email: string;
  expiryAt: Date;
  firstName: string;
  id: string;
  lastName: string;
  publicationId: string;
  roleId: number;
  updatedAt: Date;
}

/** 'FindByCode' query type */
export interface IFindByCodeQuery {
  params: IFindByCodeParams;
  result: IFindByCodeResult;
}

const findByCodeIR: any = {"usedParamSet":{"code":true,"expiryAt":true},"params":[{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":171,"b":176}]},{"name":"expiryAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":196,"b":205}]}],"statement":"SELECT\n  id,\n  code,\n  first_name,\n  last_name,\n  email,\n  duration,\n  expiry_at,\n  publication_id,\n  role_id,\n  created_at,\n  updated_at\nFROM\n  invitation\nWHERE\n  code = :code!\n  AND expiry_at > :expiryAt!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   code,
 *   first_name,
 *   last_name,
 *   email,
 *   duration,
 *   expiry_at,
 *   publication_id,
 *   role_id,
 *   created_at,
 *   updated_at
 * FROM
 *   invitation
 * WHERE
 *   code = :code!
 *   AND expiry_at > :expiryAt!
 * ```
 */
export const findByCode = new PreparedQuery<IFindByCodeParams,IFindByCodeResult>(findByCodeIR);


/** 'CreateInvitation' parameters type */
export interface ICreateInvitationParams {
  createdAt: Date;
  duration: number;
  email: string;
  expiryAt: Date;
  firstName: string;
  invitationId: string;
  lastName: string;
  publicationId: string;
  roleId: number;
  uniqueCode: string;
  updatedAt: Date;
}

/** 'CreateInvitation' return type */
export interface ICreateInvitationResult {
  code: string;
  createdAt: Date;
  duration: number;
  email: string;
  expiryAt: Date;
  firstName: string;
  id: string;
  lastName: string;
  publicationId: string;
  roleId: number;
  updatedAt: Date;
}

/** 'CreateInvitation' query type */
export interface ICreateInvitationQuery {
  params: ICreateInvitationParams;
  result: ICreateInvitationResult;
}

const createInvitationIR: any = {"usedParamSet":{"invitationId":true,"uniqueCode":true,"firstName":true,"lastName":true,"email":true,"duration":true,"expiryAt":true,"publicationId":true,"roleId":true,"createdAt":true,"updatedAt":true},"params":[{"name":"invitationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":277,"b":290}]},{"name":"uniqueCode","required":true,"transform":{"type":"scalar"},"locs":[{"a":297,"b":308}]},{"name":"firstName","required":true,"transform":{"type":"scalar"},"locs":[{"a":315,"b":325}]},{"name":"lastName","required":true,"transform":{"type":"scalar"},"locs":[{"a":332,"b":341}]},{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":348,"b":354}]},{"name":"duration","required":true,"transform":{"type":"scalar"},"locs":[{"a":361,"b":370}]},{"name":"expiryAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":377,"b":386}]},{"name":"publicationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":393,"b":407}]},{"name":"roleId","required":true,"transform":{"type":"scalar"},"locs":[{"a":414,"b":421}]},{"name":"createdAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":428,"b":438}]},{"name":"updatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":445,"b":455}]}],"statement":"WITH update_quota AS (\n  UPDATE\n    quota\n  SET\n    occupied = occupied + 1\n)\nINSERT INTO\n  invitation (\n    id,\n    code,\n    first_name,\n    last_name,\n    email,\n    duration,\n    expiry_at,\n    publication_id,\n    role_id,\n    created_at,\n    updated_at\n  )\nVALUES\n  (\n    :invitationId!,\n    :uniqueCode!,\n    :firstName!,\n    :lastName!,\n    :email!,\n    :duration!,\n    :expiryAt!,\n    :publicationId!,\n    :roleId!,\n    :createdAt!,\n    :updatedAt!\n  ) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * WITH update_quota AS (
 *   UPDATE
 *     quota
 *   SET
 *     occupied = occupied + 1
 * )
 * INSERT INTO
 *   invitation (
 *     id,
 *     code,
 *     first_name,
 *     last_name,
 *     email,
 *     duration,
 *     expiry_at,
 *     publication_id,
 *     role_id,
 *     created_at,
 *     updated_at
 *   )
 * VALUES
 *   (
 *     :invitationId!,
 *     :uniqueCode!,
 *     :firstName!,
 *     :lastName!,
 *     :email!,
 *     :duration!,
 *     :expiryAt!,
 *     :publicationId!,
 *     :roleId!,
 *     :createdAt!,
 *     :updatedAt!
 *   ) RETURNING *
 * ```
 */
export const createInvitation = new PreparedQuery<ICreateInvitationParams,ICreateInvitationResult>(createInvitationIR);


/** 'DeleteById' parameters type */
export interface IDeleteByIdParams {
  invitationId: string;
}

/** 'DeleteById' return type */
export type IDeleteByIdResult = void;

/** 'DeleteById' query type */
export interface IDeleteByIdQuery {
  params: IDeleteByIdParams;
  result: IDeleteByIdResult;
}

const deleteByIdIR: any = {"usedParamSet":{"invitationId":true},"params":[{"name":"invitationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":38,"b":51}]}],"statement":"DELETE FROM\n  invitation\nWHERE\n  id = :invitationId!"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM
 *   invitation
 * WHERE
 *   id = :invitationId!
 * ```
 */
export const deleteById = new PreparedQuery<IDeleteByIdParams,IDeleteByIdResult>(deleteByIdIR);


/** 'UpdateExpirty' parameters type */
export interface IUpdateExpirtyParams {
  invitationId: string;
  newExpiry: Date;
}

/** 'UpdateExpirty' return type */
export interface IUpdateExpirtyResult {
  code: string;
  createdAt: Date;
  duration: number;
  email: string;
  expiryAt: Date;
  firstName: string;
  id: string;
  lastName: string;
  publicationId: string;
  roleId: number;
  updatedAt: Date;
}

/** 'UpdateExpirty' query type */
export interface IUpdateExpirtyQuery {
  params: IUpdateExpirtyParams;
  result: IUpdateExpirtyResult;
}

const updateExpirtyIR: any = {"usedParamSet":{"newExpiry":true,"invitationId":true},"params":[{"name":"newExpiry","required":true,"transform":{"type":"scalar"},"locs":[{"a":38,"b":48}]},{"name":"invitationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":63,"b":76}]}],"statement":"UPDATE\n  invitation\nSET\n  expiry_at = :newExpiry!\nWHERE\n  id = :invitationId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE
 *   invitation
 * SET
 *   expiry_at = :newExpiry!
 * WHERE
 *   id = :invitationId!
 * RETURNING *
 * ```
 */
export const updateExpirty = new PreparedQuery<IUpdateExpirtyParams,IUpdateExpirtyResult>(updateExpirtyIR);



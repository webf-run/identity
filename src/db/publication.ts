/** Types generated for queries found in "src/db/publication.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetById' parameters type */
export interface IGetByIdParams {
  id: string;
}

/** 'GetById' return type */
export interface IGetByIdResult {
  fromEmail: string;
  id: string;
  publicUrl: string;
  tenantId: string;
}

/** 'GetById' query type */
export interface IGetByIdQuery {
  params: IGetByIdParams;
  result: IGetByIdResult;
}

const getByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":85,"b":88}]}],"statement":"SELECT\n  id,\n  tenant_id,\n  from_email,\n  public_url\nFROM\n  publication\nWHERE\n  id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   tenant_id,
 *   from_email,
 *   public_url
 * FROM
 *   publication
 * WHERE
 *   id = :id!
 * ```
 */
export const getById = new PreparedQuery<IGetByIdParams,IGetByIdResult>(getByIdIR);


/** 'IsMemberOfPublication' parameters type */
export interface IIsMemberOfPublicationParams {
  publicationId: string;
  userId: string;
}

/** 'IsMemberOfPublication' return type */
export interface IIsMemberOfPublicationResult {
  count: number;
}

/** 'IsMemberOfPublication' query type */
export interface IIsMemberOfPublicationQuery {
  params: IIsMemberOfPublicationParams;
  result: IIsMemberOfPublicationResult;
}

const isMemberOfPublicationIR: any = {"usedParamSet":{"userId":true,"publicationId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":84,"b":91}]},{"name":"publicationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":116,"b":130}]}],"statement":"SELECT\n  COUNT(1) :: INT AS \"count!\"\nFROM\n  user_publication_role\nWHERE\n  user_id = :userId!\n  AND publication_id = :publicationId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   COUNT(1) :: INT AS "count!"
 * FROM
 *   user_publication_role
 * WHERE
 *   user_id = :userId!
 *   AND publication_id = :publicationId!
 * ```
 */
export const isMemberOfPublication = new PreparedQuery<IIsMemberOfPublicationParams,IIsMemberOfPublicationResult>(isMemberOfPublicationIR);


/** 'CreateNewPublicationWithUser' parameters type */
export interface ICreateNewPublicationWithUserParams {
  createdAt: Date;
  email: string;
  firstName: string;
  fromEmail: string;
  hashFn: string;
  lastName: string;
  maxCapacity: number;
  occupied: number;
  password: string;
  publicUrl: string;
  roleId: number;
  roleLinkId: string;
  sizeInMb: number;
  tenantId: string;
  tenantName: string;
  updatedAt: Date;
  userId: string;
}

/** 'CreateNewPublicationWithUser' return type */
export interface ICreateNewPublicationWithUserResult {
  id: string;
  publicationId: string;
  roleId: number;
  userId: string;
}

/** 'CreateNewPublicationWithUser' query type */
export interface ICreateNewPublicationWithUserQuery {
  params: ICreateNewPublicationWithUserParams;
  result: ICreateNewPublicationWithUserResult;
}

const createNewPublicationWithUserIR: any = {"usedParamSet":{"tenantId":true,"tenantName":true,"fromEmail":true,"publicUrl":true,"sizeInMb":true,"maxCapacity":true,"occupied":true,"userId":true,"firstName":true,"lastName":true,"email":true,"password":true,"hashFn":true,"createdAt":true,"updatedAt":true,"roleLinkId":true,"roleId":true},"params":[{"name":"tenantId","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":80},{"a":239,"b":248}]},{"name":"tenantName","required":true,"transform":{"type":"scalar"},"locs":[{"a":83,"b":94}]},{"name":"fromEmail","required":true,"transform":{"type":"scalar"},"locs":[{"a":213,"b":223}]},{"name":"publicUrl","required":true,"transform":{"type":"scalar"},"locs":[{"a":226,"b":236}]},{"name":"sizeInMb","required":true,"transform":{"type":"scalar"},"locs":[{"a":368,"b":377}]},{"name":"maxCapacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":384,"b":396}]},{"name":"occupied","required":true,"transform":{"type":"scalar"},"locs":[{"a":403,"b":412}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":638,"b":645},{"a":891,"b":898}]},{"name":"firstName","required":true,"transform":{"type":"scalar"},"locs":[{"a":654,"b":664}]},{"name":"lastName","required":true,"transform":{"type":"scalar"},"locs":[{"a":673,"b":682}]},{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":691,"b":697}]},{"name":"password","required":true,"transform":{"type":"scalar"},"locs":[{"a":706,"b":715}]},{"name":"hashFn","required":true,"transform":{"type":"scalar"},"locs":[{"a":724,"b":731}]},{"name":"createdAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":740,"b":750}]},{"name":"updatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":759,"b":769}]},{"name":"roleLinkId","required":true,"transform":{"type":"scalar"},"locs":[{"a":875,"b":886}]},{"name":"roleId","required":true,"transform":{"type":"scalar"},"locs":[{"a":925,"b":932}]}],"statement":"WITH new_tenant AS (\n  INSERT INTO\n    tenant (id, name)\n  VALUES\n    (:tenantId!, :tenantName!) RETURNING *\n),\nnew_publication AS (\n  INSERT INTO\n    publication (from_email, public_url, tenant_id)\n  VALUES\n    (:fromEmail!, :publicUrl!, :tenantId!) RETURNING id\n),\nnew_quota AS (\n  INSERT INTO\n    quota (id, size_in_mb, max_capacity, occupied)\n  SELECT\n    id,\n    :sizeInMb!,\n    :maxCapacity!,\n    :occupied!\n  FROM\n    new_publication\n),\nnew_user AS (\n  INSERT INTO\n    app_user (\n      id,\n      first_name,\n      last_name,\n      email,\n      password,\n      hash_fn,\n      created_at,\n      updated_at\n    )\n  VALUES\n    (\n      :userId!,\n      :firstName!,\n      :lastName!,\n      :email!,\n      :password!,\n      :hashFn!,\n      :createdAt!,\n      :updatedAt!\n    ) RETURNING *\n)\nINSERT INTO\n  user_publication_role (id, user_id, publication_id, role_id)\nSELECT\n  :roleLinkId!,\n  :userId!,\n  new_publication.id,\n  :roleId!\nFROM\n  new_publication RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * WITH new_tenant AS (
 *   INSERT INTO
 *     tenant (id, name)
 *   VALUES
 *     (:tenantId!, :tenantName!) RETURNING *
 * ),
 * new_publication AS (
 *   INSERT INTO
 *     publication (from_email, public_url, tenant_id)
 *   VALUES
 *     (:fromEmail!, :publicUrl!, :tenantId!) RETURNING id
 * ),
 * new_quota AS (
 *   INSERT INTO
 *     quota (id, size_in_mb, max_capacity, occupied)
 *   SELECT
 *     id,
 *     :sizeInMb!,
 *     :maxCapacity!,
 *     :occupied!
 *   FROM
 *     new_publication
 * ),
 * new_user AS (
 *   INSERT INTO
 *     app_user (
 *       id,
 *       first_name,
 *       last_name,
 *       email,
 *       password,
 *       hash_fn,
 *       created_at,
 *       updated_at
 *     )
 *   VALUES
 *     (
 *       :userId!,
 *       :firstName!,
 *       :lastName!,
 *       :email!,
 *       :password!,
 *       :hashFn!,
 *       :createdAt!,
 *       :updatedAt!
 *     ) RETURNING *
 * )
 * INSERT INTO
 *   user_publication_role (id, user_id, publication_id, role_id)
 * SELECT
 *   :roleLinkId!,
 *   :userId!,
 *   new_publication.id,
 *   :roleId!
 * FROM
 *   new_publication RETURNING *
 * ```
 */
export const createNewPublicationWithUser = new PreparedQuery<ICreateNewPublicationWithUserParams,ICreateNewPublicationWithUserResult>(createNewPublicationWithUserIR);


/** 'CreatePublicationWithInvitation' parameters type */
export interface ICreatePublicationWithInvitationParams {
  createdAt: Date;
  duration: number;
  email: string;
  expiryAt: Date;
  firstName: string;
  fromEmail: string;
  invitationId: string;
  lastName: string;
  maxCapacity: number;
  occupied: number;
  publicUrl: string;
  roleId: number;
  sizeInMb: number;
  tenantId: string;
  tenantName: string;
  uniqueCode: string;
  updatedAt: Date;
}

/** 'CreatePublicationWithInvitation' return type */
export interface ICreatePublicationWithInvitationResult {
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

/** 'CreatePublicationWithInvitation' query type */
export interface ICreatePublicationWithInvitationQuery {
  params: ICreatePublicationWithInvitationParams;
  result: ICreatePublicationWithInvitationResult;
}

const createPublicationWithInvitationIR: any = {"usedParamSet":{"tenantId":true,"tenantName":true,"fromEmail":true,"publicUrl":true,"sizeInMb":true,"maxCapacity":true,"occupied":true,"invitationId":true,"uniqueCode":true,"firstName":true,"lastName":true,"email":true,"duration":true,"expiryAt":true,"roleId":true,"createdAt":true,"updatedAt":true},"params":[{"name":"tenantId","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":80},{"a":227,"b":236}]},{"name":"tenantName","required":true,"transform":{"type":"scalar"},"locs":[{"a":83,"b":94}]},{"name":"fromEmail","required":true,"transform":{"type":"scalar"},"locs":[{"a":201,"b":211}]},{"name":"publicUrl","required":true,"transform":{"type":"scalar"},"locs":[{"a":214,"b":224}]},{"name":"sizeInMb","required":true,"transform":{"type":"scalar"},"locs":[{"a":356,"b":365}]},{"name":"maxCapacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":372,"b":384}]},{"name":"occupied","required":true,"transform":{"type":"scalar"},"locs":[{"a":391,"b":400}]},{"name":"invitationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":624,"b":637}]},{"name":"uniqueCode","required":true,"transform":{"type":"scalar"},"locs":[{"a":642,"b":653}]},{"name":"firstName","required":true,"transform":{"type":"scalar"},"locs":[{"a":658,"b":668}]},{"name":"lastName","required":true,"transform":{"type":"scalar"},"locs":[{"a":673,"b":682}]},{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":687,"b":693}]},{"name":"duration","required":true,"transform":{"type":"scalar"},"locs":[{"a":698,"b":707}]},{"name":"expiryAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":712,"b":721}]},{"name":"roleId","required":true,"transform":{"type":"scalar"},"locs":[{"a":748,"b":755}]},{"name":"createdAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":760,"b":770}]},{"name":"updatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":775,"b":785}]}],"statement":"WITH new_tenant AS (\n  INSERT INTO\n    tenant (id, name)\n  VALUES\n    (:tenantId!, :tenantName!)\n),\nnew_publication AS (\n  INSERT INTO\n    publication (from_email, public_url, tenant_id)\n  VALUES\n    (:fromEmail!, :publicUrl!, :tenantId!) RETURNING id\n),\nnew_quota AS (\n  INSERT INTO\n    quota (id, size_in_mb, max_capacity, occupied)\n  SELECT\n    id,\n    :sizeInMb!,\n    :maxCapacity!,\n    :occupied!\n  FROM\n    new_publication\n)\nINSERT INTO\n  invitation (\n    id,\n    code,\n    first_name,\n    last_name,\n    email,\n    duration,\n    expiry_at,\n    publication_id,\n    role_id,\n    created_at,\n    updated_at\n  )\nSELECT\n  :invitationId!,\n  :uniqueCode!,\n  :firstName!,\n  :lastName!,\n  :email!,\n  :duration!,\n  :expiryAt!,\n  new_publication.id,\n  :roleId!,\n  :createdAt!,\n  :updatedAt!\nFROM\n  new_publication RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * WITH new_tenant AS (
 *   INSERT INTO
 *     tenant (id, name)
 *   VALUES
 *     (:tenantId!, :tenantName!)
 * ),
 * new_publication AS (
 *   INSERT INTO
 *     publication (from_email, public_url, tenant_id)
 *   VALUES
 *     (:fromEmail!, :publicUrl!, :tenantId!) RETURNING id
 * ),
 * new_quota AS (
 *   INSERT INTO
 *     quota (id, size_in_mb, max_capacity, occupied)
 *   SELECT
 *     id,
 *     :sizeInMb!,
 *     :maxCapacity!,
 *     :occupied!
 *   FROM
 *     new_publication
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
 * SELECT
 *   :invitationId!,
 *   :uniqueCode!,
 *   :firstName!,
 *   :lastName!,
 *   :email!,
 *   :duration!,
 *   :expiryAt!,
 *   new_publication.id,
 *   :roleId!,
 *   :createdAt!,
 *   :updatedAt!
 * FROM
 *   new_publication RETURNING *
 * ```
 */
export const createPublicationWithInvitation = new PreparedQuery<ICreatePublicationWithInvitationParams,ICreatePublicationWithInvitationResult>(createPublicationWithInvitationIR);



/** Types generated for queries found in "src/db/tag.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetTagById' parameters type */
export interface IGetTagByIdParams {
  id: string;
}

/** 'GetTagById' return type */
export interface IGetTagByIdResult {
  approved: boolean;
  createdAt: Date;
  description: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: Date;
}

/** 'GetTagById' query type */
export interface IGetTagByIdQuery {
  params: IGetTagByIdParams;
  result: IGetTagByIdResult;
}

const getTagByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":105,"b":108}]}],"statement":"SELECT\n  id,\n  name,\n  slug,\n  description,\n  approved,\n  created_at,\n  updated_at\nFROM\n  tag\nWHERE id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   name,
 *   slug,
 *   description,
 *   approved,
 *   created_at,
 *   updated_at
 * FROM
 *   tag
 * WHERE id = :id!
 * ```
 */
export const getTagById = new PreparedQuery<IGetTagByIdParams,IGetTagByIdResult>(getTagByIdIR);


/** 'FindBySimilarSlug' parameters type */
export interface IFindBySimilarSlugParams {
  slugPattern: string | null | void;
}

/** 'FindBySimilarSlug' return type */
export interface IFindBySimilarSlugResult {
  approved: boolean;
  createdAt: Date;
  description: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: Date;
}

/** 'FindBySimilarSlug' query type */
export interface IFindBySimilarSlugQuery {
  params: IFindBySimilarSlugParams;
  result: IFindBySimilarSlugResult;
}

const findBySimilarSlugIR: any = {"usedParamSet":{"slugPattern":true},"params":[{"name":"slugPattern","required":false,"transform":{"type":"scalar"},"locs":[{"a":110,"b":121}]}],"statement":"SELECT\n  id,\n  name,\n  slug,\n  description,\n  approved,\n  created_at,\n  updated_at\nFROM\n  tag\nWHERE slug LIKE :slugPattern"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   name,
 *   slug,
 *   description,
 *   approved,
 *   created_at,
 *   updated_at
 * FROM
 *   tag
 * WHERE slug LIKE :slugPattern
 * ```
 */
export const findBySimilarSlug = new PreparedQuery<IFindBySimilarSlugParams,IFindBySimilarSlugResult>(findBySimilarSlugIR);


/** 'CreateNewTag' parameters type */
export interface ICreateNewTagParams {
  approved: boolean;
  createdAt: Date;
  description: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: Date;
}

/** 'CreateNewTag' return type */
export interface ICreateNewTagResult {
  approved: boolean;
  createdAt: Date;
  description: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: Date;
}

/** 'CreateNewTag' query type */
export interface ICreateNewTagQuery {
  params: ICreateNewTagParams;
  result: ICreateNewTagResult;
}

const createNewTagIR: any = {"usedParamSet":{"id":true,"name":true,"slug":true,"description":true,"approved":true,"createdAt":true,"updatedAt":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":129,"b":132}]},{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":144}]},{"name":"slug","required":true,"transform":{"type":"scalar"},"locs":[{"a":151,"b":156}]},{"name":"description","required":true,"transform":{"type":"scalar"},"locs":[{"a":163,"b":175}]},{"name":"approved","required":true,"transform":{"type":"scalar"},"locs":[{"a":182,"b":191}]},{"name":"createdAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":198,"b":208}]},{"name":"updatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":215,"b":225}]}],"statement":"INSERT INTO\n  tag (\n    id,\n    name,\n    slug,\n    description,\n    approved,\n    created_at,\n    updated_at\n  )\n  VALUES (\n    :id!,\n    :name!,\n    :slug!,\n    :description!,\n    :approved!,\n    :createdAt!,\n    :updatedAt!\n) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   tag (
 *     id,
 *     name,
 *     slug,
 *     description,
 *     approved,
 *     created_at,
 *     updated_at
 *   )
 *   VALUES (
 *     :id!,
 *     :name!,
 *     :slug!,
 *     :description!,
 *     :approved!,
 *     :createdAt!,
 *     :updatedAt!
 * ) RETURNING *
 * ```
 */
export const createNewTag = new PreparedQuery<ICreateNewTagParams,ICreateNewTagResult>(createNewTagIR);


/** 'UpdateTag' parameters type */
export interface IUpdateTagParams {
  description: string;
  id: string;
  name: string;
  slug: string;
}

/** 'UpdateTag' return type */
export interface IUpdateTagResult {
  approved: boolean;
  createdAt: Date;
  description: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: Date;
}

/** 'UpdateTag' query type */
export interface IUpdateTagQuery {
  params: IUpdateTagParams;
  result: IUpdateTagResult;
}

const updateTagIR: any = {"usedParamSet":{"name":true,"description":true,"slug":true,"id":true},"params":[{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":26,"b":31}]},{"name":"description","required":true,"transform":{"type":"scalar"},"locs":[{"a":50,"b":62}]},{"name":"slug","required":true,"transform":{"type":"scalar"},"locs":[{"a":74,"b":79}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":92,"b":95}]}],"statement":"UPDATE\n  tag\nSET\n  name = :name!,\n  description = :description!,\n  slug = :slug!\nWHERE id = :id!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE
 *   tag
 * SET
 *   name = :name!,
 *   description = :description!,
 *   slug = :slug!
 * WHERE id = :id!
 * RETURNING *
 * ```
 */
export const updateTag = new PreparedQuery<IUpdateTagParams,IUpdateTagResult>(updateTagIR);



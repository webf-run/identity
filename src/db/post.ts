/** Types generated for queries found in "src/db/post.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'GetPostByOwner' parameters type */
export interface IGetPostByOwnerParams {
  ownerId: string;
  postId: string;
}

/** 'GetPostByOwner' return type */
export interface IGetPostByOwnerResult {
  canonicalUrl: string | null;
  createdAt: Date;
  description: string;
  id: string;
  imageId: string | null;
  ownerId: string;
  publicationId: string;
  publishedAt: Date | null;
  slug: string;
  title: string;
  updatedAt: Date;
}

/** 'GetPostByOwner' query type */
export interface IGetPostByOwnerQuery {
  params: IGetPostByOwnerParams;
  result: IGetPostByOwnerResult;
}

const getPostByOwnerIR: any = {"usedParamSet":{"postId":true,"ownerId":true},"params":[{"name":"postId","required":true,"transform":{"type":"scalar"},"locs":[{"a":296,"b":303}]},{"name":"ownerId","required":true,"transform":{"type":"scalar"},"locs":[{"a":327,"b":335}]}],"statement":"SELECT\n  post.id,\n  post.owner_id,\n  post.slug,\n  post.canonical_url,\n  post.publication_id,\n  post.created_at,\n  post.updated_at,\n  post.published_at,\n  post_meta.title,\n  post_meta.description,\n  post_meta.image_id\nFROM\n  post\nINNER JOIN\n  post_meta ON post.id = post_meta.id\nWHERE\n  post.id = :postId!\n  AND post.owner_id = :ownerId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   post.id,
 *   post.owner_id,
 *   post.slug,
 *   post.canonical_url,
 *   post.publication_id,
 *   post.created_at,
 *   post.updated_at,
 *   post.published_at,
 *   post_meta.title,
 *   post_meta.description,
 *   post_meta.image_id
 * FROM
 *   post
 * INNER JOIN
 *   post_meta ON post.id = post_meta.id
 * WHERE
 *   post.id = :postId!
 *   AND post.owner_id = :ownerId!
 * ```
 */
export const getPostByOwner = new PreparedQuery<IGetPostByOwnerParams,IGetPostByOwnerResult>(getPostByOwnerIR);


/** 'GetPostByPublication' parameters type */
export interface IGetPostByPublicationParams {
  postId: string;
  publicationId: string;
}

/** 'GetPostByPublication' return type */
export interface IGetPostByPublicationResult {
  canonicalUrl: string | null;
  createdAt: Date;
  description: string;
  id: string;
  imageId: string | null;
  ownerId: string;
  publicationId: string;
  publishedAt: Date | null;
  slug: string;
  title: string;
  updatedAt: Date;
}

/** 'GetPostByPublication' query type */
export interface IGetPostByPublicationQuery {
  params: IGetPostByPublicationParams;
  result: IGetPostByPublicationResult;
}

const getPostByPublicationIR: any = {"usedParamSet":{"postId":true,"publicationId":true},"params":[{"name":"postId","required":true,"transform":{"type":"scalar"},"locs":[{"a":296,"b":303}]},{"name":"publicationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":328,"b":342}]}],"statement":"SELECT\n  post.id,\n  post.owner_id,\n  post.slug,\n  post.canonical_url,\n  post.publication_id,\n  post.created_at,\n  post.updated_at,\n  post.published_at,\n  post_meta.title,\n  post_meta.description,\n  post_meta.image_id\nFROM\n  post\nINNER JOIN\n  post_meta ON post.id = post_meta.id\nWHERE\n  post.id = :postId!\n  AND publication_id = :publicationId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   post.id,
 *   post.owner_id,
 *   post.slug,
 *   post.canonical_url,
 *   post.publication_id,
 *   post.created_at,
 *   post.updated_at,
 *   post.published_at,
 *   post_meta.title,
 *   post_meta.description,
 *   post_meta.image_id
 * FROM
 *   post
 * INNER JOIN
 *   post_meta ON post.id = post_meta.id
 * WHERE
 *   post.id = :postId!
 *   AND publication_id = :publicationId!
 * ```
 */
export const getPostByPublication = new PreparedQuery<IGetPostByPublicationParams,IGetPostByPublicationResult>(getPostByPublicationIR);


/** 'CreatePost' parameters type */
export interface ICreatePostParams {
  canonicalUrl: string | null | void;
  content: Json;
  createdAt: Date;
  description: string;
  ownerId: string;
  publicationId: string;
  slug: string;
  title: string;
  updatedAt: Date;
  version: number | null | void;
  versionId: string;
}

/** 'CreatePost' return type */
export interface ICreatePostResult {
  description: string;
  id: string;
  imageId: string | null;
  title: string;
}

/** 'CreatePost' query type */
export interface ICreatePostQuery {
  params: ICreatePostParams;
  result: ICreatePostResult;
}

const createPostIR: any = {"usedParamSet":{"ownerId":true,"slug":true,"canonicalUrl":true,"publicationId":true,"createdAt":true,"updatedAt":true,"versionId":true,"version":true,"title":true,"content":true,"description":true},"params":[{"name":"ownerId","required":true,"transform":{"type":"scalar"},"locs":[{"a":171,"b":179}]},{"name":"slug","required":true,"transform":{"type":"scalar"},"locs":[{"a":186,"b":191}]},{"name":"canonicalUrl","required":false,"transform":{"type":"scalar"},"locs":[{"a":198,"b":210}]},{"name":"publicationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":217,"b":231}]},{"name":"createdAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":238,"b":248}]},{"name":"updatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":255,"b":265}]},{"name":"versionId","required":true,"transform":{"type":"scalar"},"locs":[{"a":427,"b":437}]},{"name":"version","required":false,"transform":{"type":"scalar"},"locs":[{"a":452,"b":459}]},{"name":"title","required":true,"transform":{"type":"scalar"},"locs":[{"a":466,"b":472},{"a":591,"b":597}]},{"name":"content","required":true,"transform":{"type":"scalar"},"locs":[{"a":479,"b":487}]},{"name":"description","required":true,"transform":{"type":"scalar"},"locs":[{"a":602,"b":614}]}],"statement":"WITH new_post AS (\n  INSERT INTO\n    post (\n      owner_id,\n      slug,\n      canonical_url,\n      publication_id,\n      created_at,\n      updated_at\n    )\n  VALUES (\n    :ownerId!,\n    :slug!,\n    :canonicalUrl,\n    :publicationId!,\n    :createdAt!,\n    :updatedAt!\n  ) RETURNING *\n), new_post_version AS (\n  INSERT INTO\n    post_version (\n      id,\n      post_id,\n      version,\n      title,\n      content\n    )\n  SELECT\n    :versionId!,\n    id,\n    :version,\n    :title!,\n    :content!\n  FROM\n    new_post\n)\nINSERT INTO\n  post_meta (\n    id,\n    title,\n    description\n  )\nSELECT\n  id,\n  :title!,\n  :description!\nFROM new_post\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * WITH new_post AS (
 *   INSERT INTO
 *     post (
 *       owner_id,
 *       slug,
 *       canonical_url,
 *       publication_id,
 *       created_at,
 *       updated_at
 *     )
 *   VALUES (
 *     :ownerId!,
 *     :slug!,
 *     :canonicalUrl,
 *     :publicationId!,
 *     :createdAt!,
 *     :updatedAt!
 *   ) RETURNING *
 * ), new_post_version AS (
 *   INSERT INTO
 *     post_version (
 *       id,
 *       post_id,
 *       version,
 *       title,
 *       content
 *     )
 *   SELECT
 *     :versionId!,
 *     id,
 *     :version,
 *     :title!,
 *     :content!
 *   FROM
 *     new_post
 * )
 * INSERT INTO
 *   post_meta (
 *     id,
 *     title,
 *     description
 *   )
 * SELECT
 *   id,
 *   :title!,
 *   :description!
 * FROM new_post
 * RETURNING *
 * ```
 */
export const createPost = new PreparedQuery<ICreatePostParams,ICreatePostResult>(createPostIR);


/** 'CreateOrUpdatePostContent' parameters type */
export interface ICreateOrUpdatePostContentParams {
  content: Json;
  id: string;
  postId: string;
  title: string;
  version: number;
}

/** 'CreateOrUpdatePostContent' return type */
export interface ICreateOrUpdatePostContentResult {
  content: Json;
  id: string;
  postId: string;
  title: string;
  version: number;
}

/** 'CreateOrUpdatePostContent' query type */
export interface ICreateOrUpdatePostContentQuery {
  params: ICreateOrUpdatePostContentParams;
  result: ICreateOrUpdatePostContentResult;
}

const createOrUpdatePostContentIR: any = {"usedParamSet":{"id":true,"postId":true,"version":true,"title":true,"content":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":105,"b":108}]},{"name":"postId","required":true,"transform":{"type":"scalar"},"locs":[{"a":115,"b":122}]},{"name":"version","required":true,"transform":{"type":"scalar"},"locs":[{"a":129,"b":137}]},{"name":"title","required":true,"transform":{"type":"scalar"},"locs":[{"a":144,"b":150},{"a":226,"b":232}]},{"name":"content","required":true,"transform":{"type":"scalar"},"locs":[{"a":157,"b":165},{"a":247,"b":255}]}],"statement":"INSERT INTO\n  post_version (\n    id,\n    post_id,\n    version,\n    title,\n    content\n  )\nVALUES\n  (\n    :id!,\n    :postId!,\n    :version!,\n    :title!,\n    :content!\n  ) ON CONFLICT (post_id, version) DO\nUPDATE\nSET\n  title = :title!,\n  content = :content!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   post_version (
 *     id,
 *     post_id,
 *     version,
 *     title,
 *     content
 *   )
 * VALUES
 *   (
 *     :id!,
 *     :postId!,
 *     :version!,
 *     :title!,
 *     :content!
 *   ) ON CONFLICT (post_id, version) DO
 * UPDATE
 * SET
 *   title = :title!,
 *   content = :content!
 * RETURNING *
 * ```
 */
export const createOrUpdatePostContent = new PreparedQuery<ICreateOrUpdatePostContentParams,ICreateOrUpdatePostContentResult>(createOrUpdatePostContentIR);


/** 'UpdatePost' parameters type */
export interface IUpdatePostParams {
  canonicalUrl: string | null | void;
  postId: string;
  slug: string;
  updatedAt: Date;
}

/** 'UpdatePost' return type */
export type IUpdatePostResult = void;

/** 'UpdatePost' query type */
export interface IUpdatePostQuery {
  params: IUpdatePostParams;
  result: IUpdatePostResult;
}

const updatePostIR: any = {"usedParamSet":{"slug":true,"canonicalUrl":true,"updatedAt":true,"postId":true},"params":[{"name":"slug","required":true,"transform":{"type":"scalar"},"locs":[{"a":27,"b":32}]},{"name":"canonicalUrl","required":false,"transform":{"type":"scalar"},"locs":[{"a":53,"b":65}]},{"name":"updatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":83,"b":93}]},{"name":"postId","required":true,"transform":{"type":"scalar"},"locs":[{"a":108,"b":115}]}],"statement":"UPDATE\n  post\nSET\n  slug = :slug!,\n  canonical_url = :canonicalUrl,\n  updated_at = :updatedAt!\nWHERE\n  id = :postId!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE
 *   post
 * SET
 *   slug = :slug!,
 *   canonical_url = :canonicalUrl,
 *   updated_at = :updatedAt!
 * WHERE
 *   id = :postId!
 * ```
 */
export const updatePost = new PreparedQuery<IUpdatePostParams,IUpdatePostResult>(updatePostIR);


/** 'UpdatePostMetadata' parameters type */
export interface IUpdatePostMetadataParams {
  description: string;
  postId: string;
  title: string;
}

/** 'UpdatePostMetadata' return type */
export type IUpdatePostMetadataResult = void;

/** 'UpdatePostMetadata' query type */
export interface IUpdatePostMetadataQuery {
  params: IUpdatePostMetadataParams;
  result: IUpdatePostMetadataResult;
}

const updatePostMetadataIR: any = {"usedParamSet":{"title":true,"description":true,"postId":true},"params":[{"name":"title","required":true,"transform":{"type":"scalar"},"locs":[{"a":33,"b":39}]},{"name":"description","required":true,"transform":{"type":"scalar"},"locs":[{"a":58,"b":70}]},{"name":"postId","required":true,"transform":{"type":"scalar"},"locs":[{"a":85,"b":92}]}],"statement":"UPDATE\n  post_meta\nSET\n  title = :title!,\n  description = :description!\nWHERE\n  id = :postId!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE
 *   post_meta
 * SET
 *   title = :title!,
 *   description = :description!
 * WHERE
 *   id = :postId!
 * ```
 */
export const updatePostMetadata = new PreparedQuery<IUpdatePostMetadataParams,IUpdatePostMetadataResult>(updatePostMetadataIR);


/** 'DetachTags' parameters type */
export interface IDetachTagsParams {
  postId: string;
  tags: readonly (string)[];
}

/** 'DetachTags' return type */
export type IDetachTagsResult = void;

/** 'DetachTags' query type */
export interface IDetachTagsQuery {
  params: IDetachTagsParams;
  result: IDetachTagsResult;
}

const detachTagsIR: any = {"usedParamSet":{"postId":true,"tags":true},"params":[{"name":"tags","required":true,"transform":{"type":"array_spread"},"locs":[{"a":67,"b":72}]},{"name":"postId","required":true,"transform":{"type":"scalar"},"locs":[{"a":41,"b":48}]}],"statement":"DELETE FROM\n  post_tag\nWHERE\n  post_id = :postId!\n  AND tag_id IN (:tags!)"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM
 *   post_tag
 * WHERE
 *   post_id = :postId!
 *   AND tag_id IN (:tags!)
 * ```
 */
export const detachTags = new PreparedQuery<IDetachTagsParams,IDetachTagsResult>(detachTagsIR);


/** 'AttachTags' parameters type */
export interface IAttachTagsParams {
  tags: readonly ({
    postId: string,
    tagId: string,
    order: number
  })[];
}

/** 'AttachTags' return type */
export interface IAttachTagsResult {
  order: number;
  postId: string;
  tagId: string;
}

/** 'AttachTags' query type */
export interface IAttachTagsQuery {
  params: IAttachTagsParams;
  result: IAttachTagsResult;
}

const attachTagsIR: any = {"usedParamSet":{"tags":true},"params":[{"name":"tags","required":false,"transform":{"type":"pick_array_spread","keys":[{"name":"postId","required":true},{"name":"tagId","required":true},{"name":"order","required":true}]},"locs":[{"a":75,"b":79}]}],"statement":"INSERT INTO\n  post_tag (\n    post_id,\n    tag_id,\n    \"order\"\n  )\nVALUES\n  :tags\nON CONFLICT (post_id, tag_id) DO\nUPDATE\nSET\n  \"order\" = EXCLUDED.order\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   post_tag (
 *     post_id,
 *     tag_id,
 *     "order"
 *   )
 * VALUES
 *   :tags
 * ON CONFLICT (post_id, tag_id) DO
 * UPDATE
 * SET
 *   "order" = EXCLUDED.order
 * RETURNING *
 * ```
 */
export const attachTags = new PreparedQuery<IAttachTagsParams,IAttachTagsResult>(attachTagsIR);


/** 'SetPublishDate' parameters type */
export interface ISetPublishDateParams {
  postId: string;
  publishedAt: Date;
}

/** 'SetPublishDate' return type */
export type ISetPublishDateResult = void;

/** 'SetPublishDate' query type */
export interface ISetPublishDateQuery {
  params: ISetPublishDateParams;
  result: ISetPublishDateResult;
}

const setPublishDateIR: any = {"usedParamSet":{"publishedAt":true,"postId":true},"params":[{"name":"publishedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":35,"b":47},{"a":65,"b":77}]},{"name":"postId","required":true,"transform":{"type":"scalar"},"locs":[{"a":92,"b":99}]}],"statement":"UPDATE\n  post\nSET\n  published_at = :publishedAt!,\n  updated_at = :publishedAt!\nWHERE\n  id = :postId!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE
 *   post
 * SET
 *   published_at = :publishedAt!,
 *   updated_at = :publishedAt!
 * WHERE
 *   id = :postId!
 * ```
 */
export const setPublishDate = new PreparedQuery<ISetPublishDateParams,ISetPublishDateResult>(setPublishDateIR);


/** 'UnsetPublishDate' parameters type */
export interface IUnsetPublishDateParams {
  postId: string;
  updatedAt: Date;
}

/** 'UnsetPublishDate' return type */
export type IUnsetPublishDateResult = void;

/** 'UnsetPublishDate' query type */
export interface IUnsetPublishDateQuery {
  params: IUnsetPublishDateParams;
  result: IUnsetPublishDateResult;
}

const unsetPublishDateIR: any = {"usedParamSet":{"updatedAt":true,"postId":true},"params":[{"name":"updatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":56,"b":66}]},{"name":"postId","required":true,"transform":{"type":"scalar"},"locs":[{"a":81,"b":88}]}],"statement":"UPDATE\n  post\nSET\n  published_at = NULL,\n  updated_at = :updatedAt!\nWHERE\n  id = :postId!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE
 *   post
 * SET
 *   published_at = NULL,
 *   updated_at = :updatedAt!
 * WHERE
 *   id = :postId!
 * ```
 */
export const unsetPublishDate = new PreparedQuery<IUnsetPublishDateParams,IUnsetPublishDateResult>(unsetPublishDateIR);


/** 'DeleteStalePostVersions' parameters type */
export interface IDeleteStalePostVersionsParams {
  postId: string;
}

/** 'DeleteStalePostVersions' return type */
export type IDeleteStalePostVersionsResult = void;

/** 'DeleteStalePostVersions' query type */
export interface IDeleteStalePostVersionsQuery {
  params: IDeleteStalePostVersionsParams;
  result: IDeleteStalePostVersionsResult;
}

const deleteStalePostVersionsIR: any = {"usedParamSet":{"postId":true},"params":[{"name":"postId","required":true,"transform":{"type":"scalar"},"locs":[{"a":83,"b":90},{"a":285,"b":292}]}],"statement":"WITH delete_post_version AS (\n  DELETE FROM\n    post_version\n  WHERE\n    post_id = :postId!\n    AND version IN (\n      SELECT\n        version\n      FROM\n        post_version\n      ORDER BY\n        version DESC OFFSET 1\n    )\n)\nUPDATE\n  post_version\nSET\n  version = 0\nWHERE\n  post_id = :postId!"};

/**
 * Query generated from SQL:
 * ```
 * WITH delete_post_version AS (
 *   DELETE FROM
 *     post_version
 *   WHERE
 *     post_id = :postId!
 *     AND version IN (
 *       SELECT
 *         version
 *       FROM
 *         post_version
 *       ORDER BY
 *         version DESC OFFSET 1
 *     )
 * )
 * UPDATE
 *   post_version
 * SET
 *   version = 0
 * WHERE
 *   post_id = :postId!
 * ```
 */
export const deleteStalePostVersions = new PreparedQuery<IDeleteStalePostVersionsParams,IDeleteStalePostVersionsResult>(deleteStalePostVersionsIR);



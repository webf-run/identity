/** Types generated for queries found in "src/db/asset.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'CreateAssetStorage' parameters type */
export interface ICreateAssetStorageParams {
  bucket: string;
  cloudType: string;
  key: string;
  publicUrl: string;
  region: string;
  secret: string;
  uploadUrl: string;
}

/** 'CreateAssetStorage' return type */
export interface ICreateAssetStorageResult {
  bucket: string;
  cloudType: string;
  id: number;
  key: string;
  publicUrl: string;
  region: string;
  secret: string;
  uploadUrl: string;
}

/** 'CreateAssetStorage' query type */
export interface ICreateAssetStorageQuery {
  params: ICreateAssetStorageParams;
  result: ICreateAssetStorageResult;
}

const createAssetStorageIR: any = {"usedParamSet":{"cloudType":true,"region":true,"bucket":true,"publicUrl":true,"uploadUrl":true,"key":true,"secret":true},"params":[{"name":"cloudType","required":true,"transform":{"type":"scalar"},"locs":[{"a":141,"b":151}]},{"name":"region","required":true,"transform":{"type":"scalar"},"locs":[{"a":158,"b":165}]},{"name":"bucket","required":true,"transform":{"type":"scalar"},"locs":[{"a":172,"b":179}]},{"name":"publicUrl","required":true,"transform":{"type":"scalar"},"locs":[{"a":186,"b":196}]},{"name":"uploadUrl","required":true,"transform":{"type":"scalar"},"locs":[{"a":203,"b":213}]},{"name":"key","required":true,"transform":{"type":"scalar"},"locs":[{"a":220,"b":224}]},{"name":"secret","required":true,"transform":{"type":"scalar"},"locs":[{"a":231,"b":238}]}],"statement":"INSERT INTO\n  asset_storage (\n    cloud_type,\n    region,\n    bucket,\n    public_url,\n    upload_url,\n    key,\n    secret\n  )\nVALUES\n  (\n    :cloudType!,\n    :region!,\n    :bucket!,\n    :publicUrl!,\n    :uploadUrl!,\n    :key!,\n    :secret!\n  ) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   asset_storage (
 *     cloud_type,
 *     region,
 *     bucket,
 *     public_url,
 *     upload_url,
 *     key,
 *     secret
 *   )
 * VALUES
 *   (
 *     :cloudType!,
 *     :region!,
 *     :bucket!,
 *     :publicUrl!,
 *     :uploadUrl!,
 *     :key!,
 *     :secret!
 *   ) RETURNING *
 * ```
 */
export const createAssetStorage = new PreparedQuery<ICreateAssetStorageParams,ICreateAssetStorageResult>(createAssetStorageIR);


/** 'FindLeastUsedStorage' parameters type */
export type IFindLeastUsedStorageParams = void;

/** 'FindLeastUsedStorage' return type */
export interface IFindLeastUsedStorageResult {
  assetCount: number | null;
  bucket: string;
  cloudType: string;
  id: number;
  key: string;
  publicUrl: string;
  region: string;
  secret: string;
  uploadUrl: string;
}

/** 'FindLeastUsedStorage' query type */
export interface IFindLeastUsedStorageQuery {
  params: IFindLeastUsedStorageParams;
  result: IFindLeastUsedStorageResult;
}

const findLeastUsedStorageIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  asset_storage.id,\n  asset_storage.cloud_type,\n  asset_storage.region,\n  asset_storage.bucket,\n  asset_storage.public_url,\n  asset_storage.upload_url,\n  asset_storage.key,\n  asset_storage.secret,\n  count(asset.source_id)::int AS asset_count\nFROM\n  asset_storage\n  LEFT JOIN asset\n    ON asset_storage.id = asset.source_id\nGROUP BY asset_storage.id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   asset_storage.id,
 *   asset_storage.cloud_type,
 *   asset_storage.region,
 *   asset_storage.bucket,
 *   asset_storage.public_url,
 *   asset_storage.upload_url,
 *   asset_storage.key,
 *   asset_storage.secret,
 *   count(asset.source_id)::int AS asset_count
 * FROM
 *   asset_storage
 *   LEFT JOIN asset
 *     ON asset_storage.id = asset.source_id
 * GROUP BY asset_storage.id
 * ```
 */
export const findLeastUsedStorage = new PreparedQuery<IFindLeastUsedStorageParams,IFindLeastUsedStorageResult>(findLeastUsedStorageIR);


/** 'CreateNewImage' parameters type */
export interface ICreateNewImageParams {
  altText: string;
  caption: Json;
  contentType: string;
  createdAt: Date;
  fileName: string;
  publicationId: string;
  size: number;
  sizeUnit: string;
  sourceId: number;
  title: string;
  updatedAt: Date;
  verified: boolean;
}

/** 'CreateNewImage' return type */
export interface ICreateNewImageResult {
  altText: string;
  caption: Json;
  id: string;
}

/** 'CreateNewImage' query type */
export interface ICreateNewImageQuery {
  params: ICreateNewImageParams;
  result: ICreateNewImageResult;
}

const createNewImageIR: any = {"usedParamSet":{"sourceId":true,"title":true,"fileName":true,"contentType":true,"size":true,"sizeUnit":true,"createdAt":true,"updatedAt":true,"verified":true,"publicationId":true,"caption":true,"altText":true},"params":[{"name":"sourceId","required":true,"transform":{"type":"scalar"},"locs":[{"a":236,"b":245}]},{"name":"title","required":true,"transform":{"type":"scalar"},"locs":[{"a":252,"b":258}]},{"name":"fileName","required":true,"transform":{"type":"scalar"},"locs":[{"a":265,"b":274}]},{"name":"contentType","required":true,"transform":{"type":"scalar"},"locs":[{"a":281,"b":293}]},{"name":"size","required":true,"transform":{"type":"scalar"},"locs":[{"a":300,"b":305}]},{"name":"sizeUnit","required":true,"transform":{"type":"scalar"},"locs":[{"a":312,"b":321}]},{"name":"createdAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":328,"b":338}]},{"name":"updatedAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":345,"b":355}]},{"name":"verified","required":true,"transform":{"type":"scalar"},"locs":[{"a":362,"b":371}]},{"name":"publicationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":378,"b":392}]},{"name":"caption","required":true,"transform":{"type":"scalar"},"locs":[{"a":506,"b":514}]},{"name":"altText","required":true,"transform":{"type":"scalar"},"locs":[{"a":517,"b":525}]}],"statement":"WITH asset_cte AS (\n  INSERT INTO\n    asset (\n      source_id,\n      title,\n      file_name,\n      content_type,\n      size,\n      size_unit,\n      created_at,\n      updated_at,\n      verified,\n      publication_id\n    )\n  VALUES (\n    :sourceId!,\n    :title!,\n    :fileName!,\n    :contentType!,\n    :size!,\n    :sizeUnit!,\n    :createdAt!,\n    :updatedAt!,\n    :verified!,\n    :publicationId!\n  )\n  RETURNING id AS asset_id\n)\nINSERT INTO\n  image (\n    id,\n    caption,\n    alt_text\n  )\n  SELECT asset_id, :caption!, :altText! FROM asset_cte\n  RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * WITH asset_cte AS (
 *   INSERT INTO
 *     asset (
 *       source_id,
 *       title,
 *       file_name,
 *       content_type,
 *       size,
 *       size_unit,
 *       created_at,
 *       updated_at,
 *       verified,
 *       publication_id
 *     )
 *   VALUES (
 *     :sourceId!,
 *     :title!,
 *     :fileName!,
 *     :contentType!,
 *     :size!,
 *     :sizeUnit!,
 *     :createdAt!,
 *     :updatedAt!,
 *     :verified!,
 *     :publicationId!
 *   )
 *   RETURNING id AS asset_id
 * )
 * INSERT INTO
 *   image (
 *     id,
 *     caption,
 *     alt_text
 *   )
 *   SELECT asset_id, :caption!, :altText! FROM asset_cte
 *   RETURNING *
 * ```
 */
export const createNewImage = new PreparedQuery<ICreateNewImageParams,ICreateNewImageResult>(createNewImageIR);



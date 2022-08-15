/* @name CreateAssetStorage */
INSERT INTO
  asset_storage (
    cloud_type,
    region,
    bucket,
    public_url,
    upload_url,
    key,
    secret
  )
VALUES
  (
    :cloudType!,
    :region!,
    :bucket!,
    :publicUrl!,
    :uploadUrl!,
    :key!,
    :secret!
  ) RETURNING *;


/* @name FindLeastUsedStorage */
SELECT
  asset_storage.id,
  asset_storage.cloud_type,
  asset_storage.region,
  asset_storage.bucket,
  asset_storage.public_url,
  asset_storage.upload_url,
  asset_storage.key,
  asset_storage.secret,
  count(asset.source_id)::int AS asset_count
FROM
  asset_storage
  LEFT JOIN asset
    ON asset_storage.id = asset.source_id
GROUP BY asset_storage.id;


/* @name CreateNewImage */
WITH asset_cte AS (
  INSERT INTO
    asset (
      source_id,
      title,
      file_name,
      content_type,
      size,
      size_unit,
      created_at,
      updated_at,
      verified,
      publication_id
    )
  VALUES (
    :sourceId!,
    :title!,
    :fileName!,
    :contentType!,
    :size!,
    :sizeUnit!,
    :createdAt!,
    :updatedAt!,
    :verified!,
    :publicationId!
  )
  RETURNING id AS asset_id
)
INSERT INTO
  image (
    id,
    caption,
    alt_text
  )
  SELECT asset_id, :caption!, :altText! FROM asset_cte
  RETURNING *;

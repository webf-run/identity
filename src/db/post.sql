/* @name GetPostByOwner */
SELECT
  post.id,
  post.owner_id,
  post.slug,
  post.canonical_url,
  post.publication_id,
  post.created_at,
  post.updated_at,
  post.published_at,
  post_meta.title,
  post_meta.description,
  post_meta.image_id
FROM
  post
INNER JOIN
  post_meta ON post.id = post_meta.id
WHERE
  post.id = :postId!
  AND post.owner_id = :ownerId!;


/* @name GetPostByPublication */
SELECT
  post.id,
  post.owner_id,
  post.slug,
  post.canonical_url,
  post.publication_id,
  post.created_at,
  post.updated_at,
  post.published_at,
  post_meta.title,
  post_meta.description,
  post_meta.image_id
FROM
  post
INNER JOIN
  post_meta ON post.id = post_meta.id
WHERE
  post.id = :postId!
  AND publication_id = :publicationId!;


/* @name CreatePost */
WITH new_post AS (
  INSERT INTO
    post (
      owner_id,
      slug,
      canonical_url,
      publication_id,
      created_at,
      updated_at
    )
  VALUES (
    :ownerId!,
    :slug!,
    :canonicalUrl,
    :publicationId!,
    :createdAt!,
    :updatedAt!
  ) RETURNING *
), new_post_version AS (
  INSERT INTO
    post_version (
      id,
      post_id,
      version,
      title,
      content
    )
  SELECT
    :versionId!,
    id,
    :version,
    :title!,
    :content!
  FROM
    new_post
)
INSERT INTO
  post_meta (
    id,
    title,
    description
  )
SELECT
  id,
  :title!,
  :description!
FROM new_post
RETURNING *;


/* @name CreateOrUpdatePostContent */
INSERT INTO
  post_version (
    id,
    post_id,
    version,
    title,
    content
  )
VALUES
  (
    :id!,
    :postId!,
    :version!,
    :title!,
    :content!
  ) ON CONFLICT (post_id, version) DO
UPDATE
SET
  title = :title!,
  content = :content!
RETURNING *;


/* @name UpdatePost */
UPDATE
  post
SET
  slug = :slug!,
  canonical_url = :canonicalUrl,
  updated_at = :updatedAt!
WHERE
  id = :postId!;

/* @name UpdatePostMetadata */
UPDATE
  post_meta
SET
  title = :title!,
  description = :description!
WHERE
  id = :postId!;

/*
  @name DetachTags
  @param tags -> (...)
*/
DELETE FROM
  post_tag
WHERE
  post_id = :postId!
  AND tag_id IN (:tags!);


/*
  @name AttachTags
  @param tags -> ((postId!, tagId!, order!)...)
*/
INSERT INTO
  post_tag (
    post_id,
    tag_id,
    "order"
  )
VALUES
  :tags
ON CONFLICT (post_id, tag_id) DO
UPDATE
SET
  "order" = EXCLUDED.order
RETURNING *;


/* @name SetPublishDate */
UPDATE
  post
SET
  published_at = :publishedAt!,
  updated_at = :publishedAt!
WHERE
  id = :postId!;


/* @name UnsetPublishDate */
UPDATE
  post
SET
  published_at = NULL,
  updated_at = :updatedAt!
WHERE
  id = :postId!;

/* @name DeleteStalePostVersions */
WITH delete_post_version AS (
  DELETE FROM
    post_version
  WHERE
    post_id = :postId!
    AND version IN (
      SELECT
        version
      FROM
        post_version
      ORDER BY
        version DESC OFFSET 1
    )
)
UPDATE
  post_version
SET
  version = 0
WHERE
  post_id = :postId!;

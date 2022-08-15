/* @name GetTagById */
SELECT
  id,
  name,
  slug,
  description,
  approved,
  created_at,
  updated_at
FROM
  tag
WHERE id = :id!;

/* @name FindBySimilarSlug */
SELECT
  id,
  name,
  slug,
  description,
  approved,
  created_at,
  updated_at
FROM
  tag
WHERE slug LIKE :slugPattern;


/* @name CreateNewTag */
INSERT INTO
  tag (
    id,
    name,
    slug,
    description,
    approved,
    created_at,
    updated_at
  )
  VALUES (
    :id!,
    :name!,
    :slug!,
    :description!,
    :approved!,
    :createdAt!,
    :updatedAt!
) RETURNING *;

/* @name UpdateTag */
UPDATE
  tag
SET
  name = :name!,
  description = :description!,
  slug = :slug!
WHERE id = :id!
RETURNING *;

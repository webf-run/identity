/* @name GetById */
SELECT
  id,
  description,
  secret,
  hash_fn,
  created_at,
  updated_at
FROM
  client_app
WHERE id = :id!;

/* @name GetTotalCount */
SELECT
  count(*) :: int
FROM
  client_app;

/* @name CreateClientApp */
INSERT INTO
  client_app (
    id,
    description,
    secret,
    hash_fn,
    created_at,
    updated_at
  )
VALUES
  (
    :id!,
    :description!,
    :secret!,
    :hashFn!,
    :createdAt!,
    :updatedAt!
  ) RETURNING *;

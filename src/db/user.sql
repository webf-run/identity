/* @name GetByEmail */
SELECT
  id,
  first_name,
  last_name,
  email,
  password,
  hash_fn,
  created_at,
  updated_at
FROM
  app_user
WHERE
  email = :email!;

/* @name UpdatePassword */
UPDATE
  app_user
SET
  password = :password!,
  hash_fn = :hashFn!
WHERE
  id = :id!
RETURNING *;

/* @name GetByToken */
SELECT
  token.id as "token_id",
  token.generated_at,
  token.duration,
  app_user.id as "user_id",
  app_user.first_name as "first_name",
  app_user.last_name as "last_name",
  app_user.email as "email",
  app_user.created_at as "created_at",
  app_user.updated_at as "updated_at",
  user_publication_role.role_id,
  user_publication_role.publication_id,
  publication.from_email,
  publication.public_url,
  publication.tenant_id
FROM
  user_token token
  INNER JOIN app_user
    ON token.user_id = app_user.id
  INNER JOIN user_publication_role
    ON token.user_id = user_publication_role.user_id
  INNER JOIN publication
    ON user_publication_role.publication_id = publication.id
WHERE
  token.id = :tokenId!;


/* @name CreateNewUser */
INSERT INTO
  app_user (
    id,
    first_name,
    last_name,
    email,
    password,
    hash_fn,
    created_at,
    updated_at
  )
VALUES (
  :id!,
  :firstName!,
  :lastName!,
  :email!,
  :password!,
  :hashFn!,
  :createdAt!,
  :updatedAt!
) RETURNING *;

/* @name FindClientAppByToken */
SELECT
  client_app_token.id as token,
  duration,
  generated_at,
  client_app.id,
  client_app.description,
  client_app.secret,
  client_app.hash_fn,
  client_app.created_at,
  client_app.updated_at
FROM
  client_app_token
  INNER JOIN client_app ON client_app_token.client_app_id = client_app.id
WHERE
  client_app.id = :tokenId !;

/* @name CreateUserToken */
INSERT INTO
  user_token (
    id,
    generated_at,
    duration,
    user_id
  )
VALUES
  (
    :id!,
    :generatedAt!,
    :duration!,
    :userId!
  )
RETURNING *;

/* @name CreateClientAppToken */
INSERT INTO
  client_app_token (
    id,
    generated_at,
    duration,
    client_app_id
  )
VALUES
  (
    :id!,
    :generatedAt!,
    :duration!,
    :clientAppId!
  )
RETURNING *;

/* @name CreateResetPasswordRequest */
INSERT INTO
  reset_password_request (
    id,
    code,
    user_id,
    created_at,
    updated_at
  )
VALUES
  (
    :id!,
    :code!,
    :userId!,
    :createdAt!,
    :updatedAt!
  ) RETURNING *;


/* @name FindResetPasswordRequestByEmail */
SELECT
  app_user.id as "user_id",
  count(rpq.id) :: int AS "count!"
FROM
  app_user
  LEFT JOIN reset_password_request AS rpq ON app_user.id = rpq.user_id
WHERE
  app_user.email = :email!
GROUP BY
  app_user.id;


/* @name FindResetPasswordRequestByCode */
SELECT
  id,
  code,
  user_id,
  created_at,
  updated_at
FROM
  reset_password_request
WHERE
  code = :code!
  AND updated_at >= :validTime!;

/* @name DeleteResetPasswordRequest */
DELETE FROM
  reset_password_request
WHERE
  id = :id!;

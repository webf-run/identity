/* @name EmailConfig */
SELECT
  *
FROM
  email_config
LIMIT
  1;

/* @name UpdateEmailConfig */
UPDATE
  email_config
SET
  from_name = :fromName!,
  from_email = :fromEmail!,
  api_key = :apiKey!,
  "service" = :service!
WHERE
  id = :id! RETURNING *;

/* @name CreateEmailConfig */
INSERT INTO
  email_config (id, from_name, from_email, api_key, service)
VALUES
  (
    :id!,
    :fromName!,
    :fromEmail!,
    :apiKey!,
    :service!
  ) RETURNING *;

/* @name GetById */
SELECT
  id,
  code,
  first_name,
  last_name,
  email,
  duration,
  expiry_at,
  publication_id,
  role_id,
  created_at,
  updated_at
FROM
  invitation
WHERE
  id = :invitationId!;


/* @name FindByCode */
SELECT
  id,
  code,
  first_name,
  last_name,
  email,
  duration,
  expiry_at,
  publication_id,
  role_id,
  created_at,
  updated_at
FROM
  invitation
WHERE
  code = :code!
  AND expiry_at > :expiryAt!;


/* @name CreateInvitation */
WITH update_quota AS (
  UPDATE
    quota
  SET
    occupied = occupied + 1
)
INSERT INTO
  invitation (
    id,
    code,
    first_name,
    last_name,
    email,
    duration,
    expiry_at,
    publication_id,
    role_id,
    created_at,
    updated_at
  )
VALUES
  (
    :invitationId!,
    :uniqueCode!,
    :firstName!,
    :lastName!,
    :email!,
    :duration!,
    :expiryAt!,
    :publicationId!,
    :roleId!,
    :createdAt!,
    :updatedAt!
  ) RETURNING *;


/* @name DeleteById */
DELETE FROM
  invitation
WHERE
  id = :invitationId!;


/* @name updateExpirty */
UPDATE
  invitation
SET
  expiry_at = :newExpiry!
WHERE
  id = :invitationId!
RETURNING *;

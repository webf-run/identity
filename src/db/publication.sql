/* @name GetById */
SELECT
  id,
  tenant_id,
  from_email,
  public_url
FROM
  publication
WHERE
  id = :id!;


/* @name IsMemberOfPublication */
SELECT
  COUNT(1) :: INT AS "count!"
FROM
  user_publication_role
WHERE
  user_id = :userId!
  AND publication_id = :publicationId!;


/* @name CreateNewPublicationWithUser */
WITH new_tenant AS (
  INSERT INTO
    tenant (id, name)
  VALUES
    (:tenantId!, :tenantName!) RETURNING *
),
new_publication AS (
  INSERT INTO
    publication (from_email, public_url, tenant_id)
  VALUES
    (:fromEmail!, :publicUrl!, :tenantId!) RETURNING id
),
new_quota AS (
  INSERT INTO
    quota (id, size_in_mb, max_capacity, occupied)
  SELECT
    id,
    :sizeInMb!,
    :maxCapacity!,
    :occupied!
  FROM
    new_publication
),
new_user AS (
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
  VALUES
    (
      :userId!,
      :firstName!,
      :lastName!,
      :email!,
      :password!,
      :hashFn!,
      :createdAt!,
      :updatedAt!
    ) RETURNING *
)
INSERT INTO
  user_publication_role (id, user_id, publication_id, role_id)
SELECT
  :roleLinkId!,
  :userId!,
  new_publication.id,
  :roleId!
FROM
  new_publication RETURNING *;


/* @name CreatePublicationWithInvitation */
WITH new_tenant AS (
  INSERT INTO
    tenant (id, name)
  VALUES
    (:tenantId!, :tenantName!)
),
new_publication AS (
  INSERT INTO
    publication (from_email, public_url, tenant_id)
  VALUES
    (:fromEmail!, :publicUrl!, :tenantId!) RETURNING id
),
new_quota AS (
  INSERT INTO
    quota (id, size_in_mb, max_capacity, occupied)
  SELECT
    id,
    :sizeInMb!,
    :maxCapacity!,
    :occupied!
  FROM
    new_publication
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
SELECT
  :invitationId!,
  :uniqueCode!,
  :firstName!,
  :lastName!,
  :email!,
  :duration!,
  :expiryAt!,
  new_publication.id,
  :roleId!,
  :createdAt!,
  :updatedAt!
FROM
  new_publication RETURNING *;

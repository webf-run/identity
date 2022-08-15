/* @name GetPublicationQuota */
SELECT
  id,
  size_in_mb,
  max_capacity,
  occupied
FROM
  quota
WHERE
  id = :publicationId!;

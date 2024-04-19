/**
 * The Page type is used to represent pagination in database
 * using the `limit` and `offset` parameters. The page number
 * starts from 0.
 */
export type Page = {
  number: number;
  size: number;
};

/** Types generated for queries found in "src/db/quota.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetPublicationQuota' parameters type */
export interface IGetPublicationQuotaParams {
  publicationId: string;
}

/** 'GetPublicationQuota' return type */
export interface IGetPublicationQuotaResult {
  id: string;
  maxCapacity: number;
  occupied: number;
  sizeInMb: number;
}

/** 'GetPublicationQuota' query type */
export interface IGetPublicationQuotaQuery {
  params: IGetPublicationQuotaParams;
  result: IGetPublicationQuotaResult;
}

const getPublicationQuotaIR: any = {"usedParamSet":{"publicationId":true},"params":[{"name":"publicationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":80,"b":94}]}],"statement":"SELECT\n  id,\n  size_in_mb,\n  max_capacity,\n  occupied\nFROM\n  quota\nWHERE\n  id = :publicationId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   size_in_mb,
 *   max_capacity,
 *   occupied
 * FROM
 *   quota
 * WHERE
 *   id = :publicationId!
 * ```
 */
export const getPublicationQuota = new PreparedQuery<IGetPublicationQuotaParams,IGetPublicationQuotaResult>(getPublicationQuotaIR);



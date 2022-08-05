/** Types generated for queries found in "src/query/query.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'Query1' parameters type */
export type IQuery1Params = void;

/** 'Query1' return type */
export interface IQuery1Result {
  firstName: string;
  lastName: string;
}

/** 'Query1' query type */
export interface IQuery1Query {
  params: IQuery1Params;
  result: IQuery1Result;
}

const query1IR: any = {"usedParamSet":{},"params":[],"statement":"select first_name, last_name from app_user"};

/**
 * Query generated from SQL:
 * ```
 * select first_name, last_name from app_user
 * ```
 */
export const query1 = new PreparedQuery<IQuery1Params,IQuery1Result>(query1IR);



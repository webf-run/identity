/** Types generated for queries found in "src/db/app.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'EmailConfig' parameters type */
export type IEmailConfigParams = void;

/** 'EmailConfig' return type */
export interface IEmailConfigResult {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  id: string;
  service: string;
}

/** 'EmailConfig' query type */
export interface IEmailConfigQuery {
  params: IEmailConfigParams;
  result: IEmailConfigResult;
}

const emailConfigIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  *\nFROM\n  email_config\nLIMIT\n  1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   *
 * FROM
 *   email_config
 * LIMIT
 *   1
 * ```
 */
export const emailConfig = new PreparedQuery<IEmailConfigParams,IEmailConfigResult>(emailConfigIR);


/** 'UpdateEmailConfig' parameters type */
export interface IUpdateEmailConfigParams {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  id: string;
  service: string;
}

/** 'UpdateEmailConfig' return type */
export interface IUpdateEmailConfigResult {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  id: string;
  service: string;
}

/** 'UpdateEmailConfig' query type */
export interface IUpdateEmailConfigQuery {
  params: IUpdateEmailConfigParams;
  result: IUpdateEmailConfigResult;
}

const updateEmailConfigIR: any = {"usedParamSet":{"fromName":true,"fromEmail":true,"apiKey":true,"service":true,"id":true},"params":[{"name":"fromName","required":true,"transform":{"type":"scalar"},"locs":[{"a":40,"b":49}]},{"name":"fromEmail","required":true,"transform":{"type":"scalar"},"locs":[{"a":67,"b":77}]},{"name":"apiKey","required":true,"transform":{"type":"scalar"},"locs":[{"a":92,"b":99}]},{"name":"service","required":true,"transform":{"type":"scalar"},"locs":[{"a":116,"b":124}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":142}]}],"statement":"UPDATE\n  email_config\nSET\n  from_name = :fromName!,\n  from_email = :fromEmail!,\n  api_key = :apiKey!,\n  \"service\" = :service!\nWHERE\n  id = :id! RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE
 *   email_config
 * SET
 *   from_name = :fromName!,
 *   from_email = :fromEmail!,
 *   api_key = :apiKey!,
 *   "service" = :service!
 * WHERE
 *   id = :id! RETURNING *
 * ```
 */
export const updateEmailConfig = new PreparedQuery<IUpdateEmailConfigParams,IUpdateEmailConfigResult>(updateEmailConfigIR);


/** 'CreateEmailConfig' parameters type */
export interface ICreateEmailConfigParams {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  id: string;
  service: string;
}

/** 'CreateEmailConfig' return type */
export interface ICreateEmailConfigResult {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  id: string;
  service: string;
}

/** 'CreateEmailConfig' query type */
export interface ICreateEmailConfigQuery {
  params: ICreateEmailConfigParams;
  result: ICreateEmailConfigResult;
}

const createEmailConfigIR: any = {"usedParamSet":{"id":true,"fromName":true,"fromEmail":true,"apiKey":true,"service":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":88,"b":91}]},{"name":"fromName","required":true,"transform":{"type":"scalar"},"locs":[{"a":98,"b":107}]},{"name":"fromEmail","required":true,"transform":{"type":"scalar"},"locs":[{"a":114,"b":124}]},{"name":"apiKey","required":true,"transform":{"type":"scalar"},"locs":[{"a":131,"b":138}]},{"name":"service","required":true,"transform":{"type":"scalar"},"locs":[{"a":145,"b":153}]}],"statement":"INSERT INTO\n  email_config (id, from_name, from_email, api_key, service)\nVALUES\n  (\n    :id!,\n    :fromName!,\n    :fromEmail!,\n    :apiKey!,\n    :service!\n  ) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   email_config (id, from_name, from_email, api_key, service)
 * VALUES
 *   (
 *     :id!,
 *     :fromName!,
 *     :fromEmail!,
 *     :apiKey!,
 *     :service!
 *   ) RETURNING *
 * ```
 */
export const createEmailConfig = new PreparedQuery<ICreateEmailConfigParams,ICreateEmailConfigResult>(createEmailConfigIR);



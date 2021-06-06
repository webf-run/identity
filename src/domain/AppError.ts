import { NexusGenObjects } from '../NexusTypegen';

export enum ErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  INVALID_DATA = 'INVALID_DATA',
  INVALID_AUTH_REQUEST = 'INVALID_AUTH_REQUEST',
  INVALID_TOKEN = 'INVALID_TOKEN',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CRD = 'INVALID_CREDNETIALS',
  INVALID_SCOPE = 'INVALID_SCOPE',
  NO_ASSET_SOURCE = 'NO_ASSET_SOURCE',
  NOT_FOUND = 'NOT_FOUND',
  UNIQUE_URL = 'UNIQUE_URL'
}


export type AppError = NexusGenObjects['AppError'];


export function isAppError(error: any): error is AppError {
  return error?.errors instanceof Array;
}

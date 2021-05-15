import { NexusGenObjects } from '../NexusTypegen';

export enum ErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  INVALID_DATA = 'INVALID_DATA',
  INVALID_REQUEST = 'INVALID_REQUEST',
  INVALID_CRD = 'INVALID_CREDNETIALS',
  NOT_FOUND = 'NOT_FOUND',
  UNIQUE_URL = 'UNIQUE_URL'
}

export type AppError = NexusGenObjects['AppError'];

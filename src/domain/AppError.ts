import { NexusGenObjects } from '../NexusTypegen';

export enum ErrorCode {
  INVALID_CRD = 'INVALID_CREDNETIALS',
  UNIQUE_URL = 'UNIQUE_URL'
}

export type AppError = NexusGenObjects['AppError'];

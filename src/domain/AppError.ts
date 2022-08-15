import { NexusGenObjects } from '../NexusTypegen';

import { R } from './R';


export enum ErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  INVALID_DATA = 'INVALID_DATA',
  INVALID_AUTH_REQUEST = 'INVALID_AUTH_REQUEST',
  INVALID_TOKEN = 'INVALID_TOKEN',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CRD = 'INVALID_CREDNETIALS',
  INVALID_SCOPE = 'INVALID_SCOPE',
  NO_ASSET_STORAGE = 'NO_ASSET_STORAGE',
  NOT_FOUND = 'NOT_FOUND',
  QUOTA_FULL = 'QUOTA_FULL',
  UNIQUE_URL = 'UNIQUE_URL',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}


export type AppError = NexusGenObjects['AppError'];


export function isAppError(error: any): error is AppError {
  return error?.errors instanceof Array;
}

export function makeAppError(code: string, message: string): AppError {
  return { errors: [{ code, message }]};
}

export const noAccess = () => R.ofError(ErrorCode.FORBIDDEN, 'You do not have access');
export const inviteNotFound = () => R.ofError(ErrorCode.NOT_FOUND, 'Invitation not found');
export const inviteNotYetExpired = () => R.ofError(ErrorCode.INVALID_DATA, 'Invitation is yet to be expired');

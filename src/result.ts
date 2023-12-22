export type ErrorCode =
  | 'INTERNAL_ERROR'
  | 'ALREADY_EXISTS'
  | 'INVALID_TOKEN'
  | 'FORBIDDEN'
  | 'INVALID_CREDENTIALS';

// In order to augment this by the caller, we use interface instead of type.
export interface AppError {
  code: ErrorCode;
  message: string;
}

export type Result<T> =
  | { ok: true; value: T; }
  | { ok: false; value: AppError; };

export function ok<V>(value: V): Result<V> {
  return { ok: true, value };
}

export function err<V>(code: ErrorCode, message: string): Result<V> {
  return { ok: false, value: { code, message } };
}

// I do not like this patching but it is very convenient
// as long as I am not patching global object for values.
// I am only making few types available globally.
declare global {
  type AsyncResult2<V> = Promise<Result<V>>;

  /**
   * Wraps a value of type T into a nullable type - `null | undefined | T`.
   */
  type Nil<T> = T | null | undefined;
}

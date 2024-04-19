/**
 * Wraps a value of type T into a nullable type - `null | undefined | T`.
 */
export type Nil<T> = T | null | undefined;

export enum ResultTag {
  Ok = 'ok',
  Error = 'error'
}

export type Left<V> = { tag: ResultTag.Ok; value: V; }
export type Right<E> = { tag: ResultTag.Error; error: E; };

export type Either<Value, Error> = Left<Value> | Right<Error>;

const ok = <T>(value: T) => ({ tag: ResultTag.Ok, value }) as Left<T>;
const error = <T>(error: T) => ({ tag: ResultTag.Error, error }) as Right<T>;

export const Either = { ok, error };

export enum EitherTag {
  Ok = 'ok',
  Error = 'error'
}

export type Left<V> = { tag: EitherTag.Ok; value: V; }
export type Right<E> = { tag: EitherTag.Error; error: E; };

export type Either<Value, Error> = Left<Value> | Right<Error>;

const left = <T>(value: T) => ({ tag: EitherTag.Ok, value }) as Left<T>;
const right = <T>(error: T) => ({ tag: EitherTag.Error, error }) as Right<T>;

function isLeft<V, E>(value: Either<V, E>): value is Left<V> {
  return value.tag === EitherTag.Ok;
};

function map<V, E, R>(callback: (value: V) => R) {
  return (value: Either<V, E>) => {
    return isLeft(value)
      ? callback(value.value)
      : value;
  };
}

export const Either = { isLeft, left, right, map };

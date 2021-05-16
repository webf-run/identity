export enum EitherTag {
  Ok = 'ok',
  Error = 'error'
}

export type Left<E> = { tag: EitherTag.Error; value: E; }
export type Right<V> = { tag: EitherTag.Ok; value: V; };

export type Either<Value, Error> = Left<Error> | Right<Value>;

const left = <T>(value: T) => ({ tag: EitherTag.Error, value }) as Left<T>;
const right = <T>(error: T) => ({ tag: EitherTag.Ok, value: error }) as Right<T>;

function isLeft<V, E>(value: Either<V, E>): value is Left<E> {
  return value.tag === EitherTag.Error;
};

function isRight<V, E>(value: Either<V, E>): value is Right<V> {
  return value.tag === EitherTag.Ok;
};

function map<V, R>(callback: (value: V) => R) {
  return <E>(value: Either<V, E>) => {
    return isRight(value)
      ? Either.right(callback(value.value))
      : value;
  };
}

export const Either = { isLeft, isRight, left, right, map };

import mime from 'mime-types';

import { Either } from '../util/Either';


export type Validation<T, E> = Either<T, E[]>;

export type ValidatorConfig<T, E> = {
  [key in keyof Partial<T>]:
    | Assertion<T[key], E>
    | ValidatorConfig<T[key], E>;
};

export type Assertion<T, E> = (value: T) => Validation<T, E>;


const imageMime = new Set(['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/webp']);


export function notEmpty<E = string>(msg: E): Assertion<string, E> {
  return ((value: string) =>
    (value.trim().length > 0)
      ? Either.right(value)
      : Either.left([msg]));
}


export function minLen<E = string>(minLength: number, msg: E): Assertion<string, E> {
  return (value: string) =>
    (value.length > minLength)
      ? Either.right(value)
      : Either.left([msg]);
}

export function maxLen<E = string>(maxLength: number, msg: E): Assertion<string, E> {
  return (value: string) =>
    (value.length < maxLength)
      ? Either.right(value)
      : Either.left([msg]);
}

export function length<E = string>(length: number, msg: E): Assertion<string, E> {
  return (value: string) =>
    (value.length === length)
      ? Either.right(value)
      : Either.left([msg]);
}

export function pattern<E = string>(pattern: RegExp, msg: E): Assertion<string, E> {
  return (value: string) =>
    pattern.test(value)
      ? Either.right(value)
      : Either.left([msg]);
}


export function inSet<E = string>(list: readonly string[], msg: E): Assertion<string, E> {
  const set = new Set(list);

  return (value: string) =>
    set.has(value)
      ? Either.right(value)
      : Either.left([msg]);
}


export function isImageExtension<E = string>(msg: E): Assertion<string, E> {
  return (extension: string) => {
    return imageMime.has(mime.lookup(extension) || '')
      ? Either.right(extension)
      : Either.left([msg])
  };
}


export function concat<T, E>(...assertions: Assertion<T, E>[]): Assertion<T, E> {

  const callback = (value: T) => {

    const collect: E[] = [];

    assertions.forEach((assert) => {
      const result = assert(value);

      if (Either.isLeft(result)) {
        collect.push(...result.value);
      }
    });

    if (collect.length) {
      return Either.left(collect);
    } else {
      return Either.right(value);
    }
  };

  return callback;
}


export function apply<T, E = string>(config: ValidatorConfig<T, E>): Assertion<{ [key in (keyof typeof config)]: T[key]; }, E> {

  const callback = (value: T) => {

    function traverse<X>(config: ValidatorConfig<X, E>, obj: any, collect: E[]) {

      for (const [key, asserOrConfig] of Object.entries(config)) {

        const currentValue = obj[key];

        if (isAssertion<X, E>(asserOrConfig)) {

          const result = asserOrConfig(currentValue);

          if (Either.isLeft(result)) {
            collect.push(...result.value);
          }
        } else {
          traverse(asserOrConfig as any, currentValue, collect);
        }
      }

      return collect;
    }

    const result = traverse(config, value, []);

    if (result.length) {
      return Either.left(result);
    } else {
      return Either.right(value);
    }
  };

  return callback;
}


export function collect<E>(...results: Validation<any, E>[]) {

  const list = results.reduce((acc, next) => {
    if (Either.isLeft(next)) {
      return acc.concat(next.value);
    }
    return acc;
  }, [] as E[]);

  // Right branch is useless here.
  return list.length
    ? Either.left(list)
    : Either.right({});
}


function isAssertion<T, E>(value: any): value is Assertion<T, E> {
  return typeof value === 'function';
}

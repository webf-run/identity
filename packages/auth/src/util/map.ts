export function partition<T>(list: T[], predicate: (x: T) => boolean): [T[], T[]] {
  const yes: T[] = [];
  const no: T[] = [];

  list.forEach((x) => {
    if (predicate(x)) {
      yes.push(x);
    } else {
      no.push(x);
    }
  });

  return [yes, no];
}

export function aggregate<Key, Value, T>(result: T[], key: (x: T) => Key, factory: (x: T) => Value, iter?: (x: T, y: Value) => void) {
  const map = new Map<Key, Value>();

  result.forEach((x) => {
    const keyy = key(x);
    const value = map.get(keyy) ?? factory(x);

    // Side effect
    iter?.(x, value);

    map.set(keyy, value);
  });

  return Array.from(map.values());
}

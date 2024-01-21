
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

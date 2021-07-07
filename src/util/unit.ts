
export function isEqIgnore(string1: string, string2: string) {
  return string1.toLowerCase() === string2.toLowerCase();
}


export function tryBigInt(value: string | number | bigint | boolean): bigint | null {
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

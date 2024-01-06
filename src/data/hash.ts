import argon2 from 'argon2';

export const HASH_FN = 'argon2id';

export async function hash(entity: string): Promise<[string, string]> {
  const hash = await argon2.hash(entity, { type: argon2.argon2id });

  return [hash, HASH_FN];
}


export function verify(hash: string, original: string, algo: string): Promise<boolean> {
  if (algo === HASH_FN) {
    return argon2.verify(hash, original, { type: argon2.argon2id })
  }

  throw 'Only argon2id hashing is supported';
}

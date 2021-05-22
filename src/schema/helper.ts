import { unionType } from 'nexus';
import { UnionMembers, NexusUnionTypeDef } from 'nexus/dist/core';

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export function errorUnion<T extends string>(name: T, member: Unpacked<UnionMembers>): NexusUnionTypeDef<T> {
  return unionType({
    name: name as any,
    definition(t) {
      t.members(member, 'AppError');
    },
    resolveType: (x) =>
      (typeof x === 'object' && x.hasOwnProperty('errors'))
        ? 'AppError'
        : member
  });
}


export function serializeId<T extends { id: Number | BigInt }>(x: T): Omit<T, 'id'> & { id: string; } {
  return {
    ...x,
    id: x.id.toString()
  };
}

import { v4 } from 'uuid';

import { hashPassword } from '../../data/code';
import { DbContext } from '../DbContext';
import { Invitation, User, UserWithToken } from '../Output';


export async function findUserByEmail(db: DbContext, email: string): Promise<User | null> {

  const users = await db.user.getByEmail({ email });

  return users.at(0) ?? null;
}


export async function isUserMemberOf(db: DbContext, publicationId: bigint, userId: string) {

  const membership = await db.publication.isMemberOfPublication({
    userId,
    publicationId: publicationId.toString()
  });

  return membership[0].count > 0;
}


export async function createNewUser(db: DbContext, invitation: Invitation, password: string): Promise<User | null> {
  const [passwordHashed, hashFn] = await hashPassword(password);

  const results = await db.user.createNewUser({
    id: v4(),
    firstName: invitation.firstName,
    lastName: invitation.lastName,
    email: invitation.email,
    password: passwordHashed,
    hashFn,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return results.at(0) ?? null;
}


export async function changePassword(db: DbContext, userId: string, newPassword: string) {
  const [password, hashFn] = await hashPassword(newPassword);

  return db.user.updatePassword({
    id: userId,
    password,
    hashFn
  });
}


export async function findUserToken(db: DbContext, tokenId: string): Promise<UserWithToken | null> {

  const results = await db.user.getByToken({ tokenId });
  const firstRow = results.at(0);

  if (!firstRow) {
    return null;
  }

  return {
    id: firstRow.userId,
    firstName: firstRow.firstName,
    lastName: firstRow.lastName,
    email: firstRow.email,
    createdAt: firstRow.createdAt,
    updatedAt: firstRow.updatedAt,
    token: {
      id: firstRow.tokenId,
      duration: firstRow.duration,
      generatedAt: firstRow.generatedAt,
      userId: firstRow.userId
    },
    roles: results.map((r) => ({
      roleId: r.roleId,
      publication: {
        id: BigInt(r.publicationId),
        fromEmail: r.fromEmail,
        publicUrl: r.publicUrl,
        tenantId: r.tenantId
      }
    }))
  };
}

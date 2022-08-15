import { v4 } from 'uuid';

import { DbContext } from '../DbContext';
import { NewPublicationInput } from '../Input';
import { Publication } from '../Output';

import { hashPassword } from '../../data/code';
import { PublicationRole } from '../../data/constant';
import { buildUserInvite } from '../../data/invitation';

export async function createWithCredentials(
  db: DbContext,
  input: NewPublicationInput,
  password: string): Promise<Publication> {

  const { firstName, lastName, email } = input.firstUser;

  const [passwordHashed, hashFn] = await hashPassword(password);

  const tenantId = v4();
  const userId = v4();
  const roleLinkId = v4();

  const results = await db.publication.createNewPublicationWithUser({
    // Tenant
    tenantId,
    tenantName: input.name,

    // Publication,
    publicUrl: input.publicUrl,
    fromEmail: input.fromEmail,

    // User Input
    userId,
    firstName,
    lastName,
    email,
    password: passwordHashed,
    hashFn,

    // Quota,
    occupied: 1,
    sizeInMb: input.quota.assetSize,
    maxCapacity: input.quota.maxCapacity,

    // Role linking
    roleId: PublicationRole.Owner,
    roleLinkId,

    // General inputs
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const roleLink = results[0];

  return {
    id: BigInt(roleLink.publicationId),
    tenantId,
    fromEmail: input.fromEmail,
    publicUrl: input.publicUrl
  };
}


export async function createWithInvitation(
  db: DbContext,
  input: NewPublicationInput): Promise<[Publication, string]> {

  const tenantId = v4();
  const invitation = buildUserInvite(input.firstUser, PublicationRole.Owner);

  const results = await db.publication.createPublicationWithInvitation({
    // Tenant
    tenantId,
    tenantName: input.name,

    // Publication,
    publicUrl: input.publicUrl,
    fromEmail: input.fromEmail,

    // Quota,
    occupied: 1,
    sizeInMb: input.quota.assetSize,
    maxCapacity: input.quota.maxCapacity,

    // Invitaiton Input
    ...invitation,

    // General inputs
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const invitation2 = results[0];

  const publication: Publication = {
    id: BigInt(invitation2.publicationId),
    fromEmail: input.fromEmail,
    publicUrl: input.publicUrl,
    tenantId
  };

  return [publication, invitation.uniqueCode];
}

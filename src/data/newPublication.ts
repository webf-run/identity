import { Prisma, PrismaClient } from '@prisma/client';

import { NewPublicationInput } from '../domain/Input';
import { Publication } from '../domain/Output';
import { hashPassword } from './code';
import { PublicationRole } from './constant';
import { buildUserInvite } from './invitation';


export async function createWithCredentials(
  db: PrismaClient,
  input: NewPublicationInput,
  password: string): Promise<Publication> {

  const { firstName, lastName, email } = input.firstUser;

  const [passwordHashed, hashFn] = await hashPassword(password);

  const data = buildNewPublication(input);

  data.roles = {
    create: {
      role: {
        connect: {
          id: PublicationRole.Owner
        }
      },
      user: {
        create: {
          firstName,
          lastName,
          email,
          password: passwordHashed,
          hashFn,
        }
      }
    }
  };

  const publication = await db.publication.create({ data });

  return publication;
}


export async function createWithInvitation(
  db: PrismaClient,
  input: NewPublicationInput): Promise<[Publication, string]> {

  const data = buildNewPublication(input);
  const invitation = buildUserInvite(input.firstUser, PublicationRole.Owner);

  data.invitations = {
    create: invitation
  };

  const response = await db.publication.create({ data });

  return [response, invitation.code];
}


function buildNewPublication(input: NewPublicationInput) {

  const { quota } = input;

  const request: Prisma.PublicationCreateInput = {
    publicUrl: input.publicUrl,
    fromEmail: input.fromEmail,

    quota: {
      create: {
        occupied: 1,
        sizeInMB: quota.assetSize,
        maxCapacity: quota.maxCapacity
      }
    },
    tenant: {
      create: {
        name: input.name
      }
    }
  };

  return request;
}

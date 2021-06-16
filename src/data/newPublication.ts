import { Prisma, PrismaClient, Publication, User } from '@prisma/client';

import { PublicationInput } from '../domain/Input';
import { Publication as PublicationWithProject } from '../domain/Output';
import { generateInviteCode, hashPassword } from './code';


export async function createWithExistingUser(
  db: PrismaClient,
  input: PublicationInput,
  user: User): Promise<[PublicationWithProject, string]> {

  const request = makeNewPublicationPayload(input);
  const code = generateInviteCode();

  const { firstName, lastName, email } = user;

  request.project.create!.invitations = {
    create: { firstName, lastName, code, email }
  };

  const response = await db.publication.create({ data: request });

  return [buildPublicationWithProject(response, input), code];
}


export async function createWithCredentials(
  db: PrismaClient,
  input: PublicationInput,
  password: string): Promise<PublicationWithProject> {

  const { firstName, lastName, email } = input.firstUser;

  const [passwordHashed, hashFn] = await hashPassword(password);

  const data = makeNewPublicationPayload(input);

  data.staff = {
    create: {
      user: {
        create: { firstName, lastName, email, password: passwordHashed, hashFn }
      }
    }
  };

  const publication = await db.publication.create({ data });

  return buildPublicationWithProject(publication, input);
}


export async function createWithInvitation(
  db: PrismaClient,
  input: PublicationInput): Promise<[PublicationWithProject, string]> {

  const data = makeNewPublicationPayload(input);
  const code = generateInviteCode();

  const { firstName, lastName, email } = input.firstUser;

  data.project.create!.invitations = {
    create: { firstName, lastName, code, email }
  };

  const response = await db.publication.create({ data });

  return [buildPublicationWithProject(response, input), code];
}


function makeNewPublicationPayload(input: PublicationInput) {

  const { quota } = input;

  const request: Prisma.PublicationCreateInput = {
    publicUrl: input.publicUrl,
    project: {
      create: {
        name: input.name,
        fromEmail: input.fromEmail,
        quota: {
          create: {
            occupied: 1,
            sizeInMB: quota.assetSize,
            staffCapacity: quota.staffCapacity
          }
        }
      }
    }
  };

  return request;
}

function buildPublicationWithProject(p: Publication, i: PublicationInput): PublicationWithProject {
  return {
    ...p,
    project: {
      id: p.id,
    fromEmail: i.fromEmail,
    name: i.name
    }
  };
}

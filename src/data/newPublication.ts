import { Prisma, PrismaClient, Publication, User } from '@prisma/client';

import { NewPublicationInput } from '../domain/Input';
import { Publication as PublicationWithProject } from '../domain/Output';
import { hashPassword } from './code';
import { buildUserInvite } from './invitation';


export async function createWithExistingUser(
  db: PrismaClient,
  input: NewPublicationInput,
  user: User): Promise<[PublicationWithProject, string]> {

  const request = buildNewPublication(input);
  const invitation = buildUserInvite(input.firstUser);

  request.project.create!.invitations = {
    create: buildUserInvite(user)
  };

  const response = await db.publication.create({ data: request });

  return [buildPublicationWithProject(response, input), invitation.code];
}


export async function createWithCredentials(
  db: PrismaClient,
  input: NewPublicationInput,
  password: string): Promise<PublicationWithProject> {

  const { firstName, lastName, email } = input.firstUser;

  const [passwordHashed, hashFn] = await hashPassword(password);

  const data = buildNewPublication(input);

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
  input: NewPublicationInput): Promise<[PublicationWithProject, string]> {

  const data = buildNewPublication(input);
  const invitation = buildUserInvite(input.firstUser);

  data.project.create!.invitations = {
    create: buildUserInvite(input.firstUser)
  };

  const response = await db.publication.create({ data });

  return [buildPublicationWithProject(response, input), invitation.code];
}


function buildNewPublication(input: NewPublicationInput) {

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

function buildPublicationWithProject(p: Publication, i: NewPublicationInput): PublicationWithProject {
  return {
    ...p,
    project: {
      id: p.id,
    fromEmail: i.fromEmail,
    name: i.name
    }
  };
}

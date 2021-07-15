import { Prisma, PrismaClient, Publication } from '@prisma/client';

import { NewPublicationInput } from '../domain/Input';
import { Publication as PublicationWithProject } from '../domain/Output';
import { hashPassword } from './code';
import { ProjectType, PublicationRole } from './constant';
import { buildUserInvite } from './invitation';


export async function createWithCredentials(
  db: PrismaClient,
  input: NewPublicationInput,
  password: string): Promise<PublicationWithProject> {

  const { firstName, lastName, email } = input.firstUser;

  const [passwordHashed, hashFn] = await hashPassword(password);

  const data = buildNewPublication(input);

  data.project.create!.users = {
    create: {
      firstName, lastName, email,
      password: passwordHashed, hashFn,
      role: {
        create: {
          roleId: PublicationRole.Owner
        }
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
  const invitation = buildUserInvite(input.firstUser, PublicationRole.Owner);

  data.project.create!.invitations = {
    create: invitation
  };

  const response = await db.publication.create({ data });

  return [buildPublicationWithProject(response, input), invitation.code];
}


function buildNewPublication(input: NewPublicationInput) {

  const { quota } = input;

  const request: Prisma.PublicationCreateInput = {
    publicUrl: input.publicUrl,
    // projectType: ProjectType.PUBLICATION,
    project: {
      create: {
        name: input.name,
        fromEmail: input.fromEmail,
        projectType: ProjectType.Publication,

        quota: {
          create: {
            occupied: 1,
            sizeInMB: quota.assetSize,
            maxCapacity: quota.maxCapacity
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
      name: i.name,
      projectType: p.projectType
    }
  };
}

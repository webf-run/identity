
import { Prisma, UserToken } from '@prisma/client';


const publicationDetails = Prisma.validator<Prisma.PublicationArgs>()({
  include: { project: true }
});


export type Publication = Prisma.PublicationGetPayload<typeof publicationDetails>;


export type AuthToken = UserToken & { type: string; };

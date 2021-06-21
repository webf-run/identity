import { PrismaClient } from '@prisma/client';


export function findUserByEmail(db: PrismaClient, email: string) {
  return db.user.findUnique({
    where: {
      email
    }
  });
}

export function findInvitation(db: PrismaClient, projectId: bigint, email: string) {
  return db.invitation.findFirst({
    where: {
      email, projectId
    }
  });
}


export async function isUserMemberOf(db: PrismaClient, publicationId: bigint, email: string) {
  const user = await db.user.findFirst({
    where: { email },
    include: {
      staff: {
        where: {
          publicationId
        }
      }
    }
  });

  return !!user?.staff && user.staff.length > 0;
}

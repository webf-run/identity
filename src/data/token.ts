import { PrismaClient } from '@prisma/client';


export function findUserToken(db: PrismaClient, tokenId: string) {
  return db.userToken.findUnique({
    where: {
      id: tokenId
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          email: true,
          projectId: true,
          updatedAt: true,
          role: true,
          project: {
            include: {
              publication: {
                include: {
                  project: true
                }
              }
            }
          }

        }
      }
    }
  });
}

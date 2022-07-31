import { PrismaClient, UserToken, User, PublicationUser, Publication, UserPublicationRole, } from '@prisma/client';


type TokenWithUser =
  UserToken & {
    user: Omit<User, 'password' | 'passwordHash' | 'hashFn'> & {
      roles: Array<UserPublicationRole & {
        publication: Publication;
      }>;
    };
  };

export function findUserToken(db: PrismaClient, tokenId: string): Promise<TokenWithUser | null> {
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
          updatedAt: true,
          roles: {
            include: {
              publication: true
            }
          }
        }
      }
    }
  });
}

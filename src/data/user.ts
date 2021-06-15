import { PrismaClient } from '@prisma/client';


export function findUserByEmail(db: PrismaClient, email: string) {
  return db.user.findUnique({
    where: {
      email
    }
  });
}

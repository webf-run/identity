import { ClientApp, PrismaClient } from '@prisma/client';
import { generateClientSecret, hashPassword } from './code';


export async function findClientApp(db: PrismaClient, id: string) {
  return db.clientApp.findUnique({ where: { id } });
}

export async function createClientApp(db: PrismaClient, description: string): Promise<ClientApp> {

  const secret = generateClientSecret();

  const [hashedPassword, hashFn] = await hashPassword(secret);

  const app = await db.clientApp.create({
    data: {
      description,
      secret: hashedPassword,
      hashFn,
    }
  });

  return {
    ...app,
    secret
  };

}

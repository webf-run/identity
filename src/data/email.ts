import { EmailConfig, Prisma, PrismaClient } from '@prisma/client';

import { EmailConfigInput } from '../domain/Input';


export async function getEmailConfig(db: PrismaClient): Promise<EmailConfig | null> {
  const config = await db.emailConfig.findMany({
    take: 1
  });

  return config[0] ?? null;
}


export async function updateEmailConfig(db: PrismaClient, email: EmailConfigInput): Promise<EmailConfig> {

  const input: Prisma.EmailConfigCreateInput = {
    apiKey: email.apiKey.trim(),
    fromName: email.fromName.trim(),
    fromEmail: email.fromEmail.trim(),
    service: email.service.trim()
  };

  const existing = await getEmailConfig(db);

  if (existing) {
    return db.emailConfig.update({
      where: {
        id: existing.id
      },
      data: input,
    });
  } else {
    return db.emailConfig.create({
      data: input
    });
  }

}

import { v4 } from 'uuid';

import { DbClient } from '../DbContext';
import type { EmailConfigInput } from '../Input';
import type { IUpdateEmailConfigResult } from '../../db/app';

export type EmailConfig = IUpdateEmailConfigResult;

export async function getEmailConfig(db: DbClient): Promise<EmailConfig | null> {
  const config = await db.app.emailConfig();

  return config[0] ?? null;
}


export async function updateEmailConfig(db: DbClient, email: EmailConfigInput): Promise<EmailConfig> {

  const input: EmailConfig = {
    id: '',
    apiKey: email.apiKey.trim(),
    fromName: email.fromName.trim(),
    fromEmail: email.fromEmail.trim(),
    service: email.service.trim()
  };

  const existing = await getEmailConfig(db);

  if (existing) {
    input.id = existing.id;
    const result = await db.app.updateEmailConfig(input);

    return result[0];

  } else {
    input.id = v4();
    const result = await db.app.createEmailConfig(input);

    return result[0];
  }
}

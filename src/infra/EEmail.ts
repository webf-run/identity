import { EmailConfig } from '@prisma/client';
import sgMail from '@sendgrid/mail';


export interface MailData {
  from: { name?: string; email: string; };
  to: { name?: string; email: string; };
  subject: string;
  text?: string;
  html: string;
}


export type EmailConfigLazy = () => Promise<EmailConfig | null>;


export class EmailService {

  #config: EmailConfigLazy;

  constructor(configCB: EmailConfigLazy) {
    let cache: Promise<EmailConfig | null>;

    this.#config = () => {
      if (cache) {
        return cache;
      } else {
        cache = configCB();

        return cache;
      }
    };
  }

  async send(email: MailData) {
    const config = await this.#config();

    if (!config) {
      return false;
    } else if (config.service === 'sendgrid') {
      const [response, _] = await sgMail.send(email);

      return response.statusCode >= 200
        && response.statusCode <= 300;
    }

    return false;
  }
}

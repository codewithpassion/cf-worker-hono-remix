import { Resend } from "resend";
import { MagicLinkEmail } from "./magic-link-email";

type ResendOptions = {
  apiKey: string;
  from: string;
  to: string;
};

export class EmailSender {
  constructor(private resendOptions: ResendOptions) {}

  async sendMagicLink({
    link,
    email,
    description,
  }: {
    link: string;
    email: string;
    description: string;
  }) {
    const resend = new Resend(this.resendOptions.apiKey);
    const emailData = { link, email, description };
    const { data, error } = await resend.emails.send({
      from: this.resendOptions.from,
      to: email,
      subject: `${description} Login Link`,
      react: <MagicLinkEmail {...emailData} />,
    });
    return { data, error };
  }
}

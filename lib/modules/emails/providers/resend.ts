import { Resend } from 'resend'
import type { EmailDispatcher, RenderedEmail } from '../service'

export class ResendDispatcher implements EmailDispatcher {
  private client:  Resend
  private from:    string

  constructor(apiKey?: string, from?: string) {
    this.client = new Resend(apiKey ?? process.env.RESEND_API_KEY!)
    this.from   = from ?? process.env.EMAIL_FROM_ADDRESS ?? 'Tendencies <orders@mail.tendencies.co.nz>'
  }

  async send(email: RenderedEmail): Promise<void> {
    const to = Array.isArray(email.to) ? email.to : [email.to]
    const { error } = await this.client.emails.send({
      from:    this.from,
      to,
      subject: email.subject,
      html:    email.html,
      text:    email.text,
    })
    if (error) throw new Error(`Resend send failed: ${(error as any).message ?? JSON.stringify(error)}`)
  }
}

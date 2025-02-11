import { createMiddleware } from "hono/factory";
import { EmailSender } from "./email/sender";

const emailSenderMiddleware = createMiddleware(async (c, next) => {
    c.set('emailSender', new EmailSender({
        apiKey: c.env.RESEND_API_KEY,
        from: c.env.RESEND_FROM_EMAIL,
        to: c.env.RESEND_TO_EMAIL,
    }))
    await next();
})

export { emailSenderMiddleware }
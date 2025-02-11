import type { DatabaseBindings, DBVariables } from "@prtctyai/database";
import type { EmailSender } from "./email/sender";

export type AuthBindings = { 
    JWT_SECRET: string;
    RESEND_API_KEY: string;
    RESEND_FROM_EMAIL: string;
    RESEND_TO_EMAIL: string;
}

export type AppType = {
    Variables: DBVariables & {
        EmailSender: EmailSender;
        
        jwtPayload: {
            sub: string
            roles: string[]
            project: string
          },
    };
    Bindings: DatabaseBindings & AuthBindings;
}
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Image } from "~/components/ui/image";
import heimdal from "~/assets/heimdall.png";

import { Form, useActionData } from "@remix-run/react";
import { action as magicLinkAction } from "../loaders/magic-link.action.server"
import { useEffect, useMemo } from "react";

type ActionData = 
  | { error: string; success?: never }
  | { error?: never; success: true };

export const action = magicLinkAction;


export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";

export default function Login() {

  const actionData = useActionData<ActionData>();

  useEffect(() => {
    if (actionData?.success && typeof window !== "undefined") {
      const emailAddress = (document.getElementById("email") as HTMLInputElement).value;
      localStorage.setItem("emailAddress", emailAddress);
    }
  }, [actionData?.success])

  const defaultEmail = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("emailAddress") || "";
    }
    return "";
  }, []);
  
  return (
      <Form method="post" className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">

      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] md:w-[450px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                defaultValue={defaultEmail}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
            >
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
          {actionData?.error ? (
            <div className="text-red-500 text-sm">Invalid login</div>
          ) : actionData?.success ? (
            <p className="text-green-500 text-xl font-semibold">
                Success, please check your email!
              </p>
          ) : null}
          </div>
        </div>
      </div>
      {/* <LoginValidating open={validating} token={token} /> */}
      <div className="hidden bg-muted lg:block">
        <Image
          src={heimdal}
          alt="Heimdall"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      </Form>
  );
}

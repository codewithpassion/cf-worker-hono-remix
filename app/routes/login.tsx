import { ActionFunctionArgs, } from "@remix-run/node";
import { Form, useActionData, useLocation } from "@remix-run/react";
import { z } from "zod";
import { action as magicLinkAction } from "../loaders/magic-link.action.server"

type ActionData = 
  | { error: string; success?: never }
  | { error?: never; success: true };

export const action = magicLinkAction;

export default function Login() {
  const actionData = useActionData<ActionData>();


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          {actionData?.error ? (
            <div className="text-red-500 text-sm">{actionData.error}</div>
          ) : actionData?.success ? (
            <div className="text-green-500 text-sm">Please check your email</div>
          ) : null}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

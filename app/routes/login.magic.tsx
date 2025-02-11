import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { verifyMagicLinkToken } from "~/loaders/magic-link.action.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return redirect("/login");
  }
  return await verifyMagicLinkToken({ request, token, redirectTo: "/dashboard", params: {}, context });
}

export default function Magic() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
        <div className="animate-pulse">
          Validating your login...
        </div>
      </div>
    </div>
  );
}

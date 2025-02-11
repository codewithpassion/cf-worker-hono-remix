import { loader as authenticatedLoader } from "../loaders/authenticated.loader.server"
import { logoutAction } from "~/loaders/logout.server";
import { Form } from "@remix-run/react";


export const loader = authenticatedLoader;
export const action = logoutAction;

export default function Dashboard() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Dashboard
                    </h2>
                </div>
                <Form method="post">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Logout
                    </button>
                </Form>
            </div>
        </div>
    )
}

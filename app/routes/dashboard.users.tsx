import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import type { User } from "@prtctyai/database";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { AddUserDialog } from "~/components/ui/add-user-dialog";
import { EditUserDialog } from "~/components/ui/edit-user-dialog";
import { DeleteUserDialog } from "~/components/ui/delete-user-dialog";
import { requireUserRoles } from "~/loaders/authenticated.loader.server";
import { redirect } from "react-router";
import { Role } from "packages/database/db/schema";


export async function loader(args: LoaderFunctionArgs) {
    if (((await requireUserRoles({ ...args, requiredRoles: ['Super-Admin'] }))) === false) {
        return redirect("/dashboard");
    }

    const users = await args.context.cloudflare.var.Repositories.user.getAll();
    return { users };
}

export async function action({ request, context }: ActionFunctionArgs) {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as Role;
    const isActive = formData.get("isActive") === "on";

    const intent = formData.get("intent");

    if (intent === "delete") {
        const id = formData.get("id") as string;
        await context.cloudflare.var.Repositories.user.delete(parseInt(id));
        return json({ success: true });
    }

    if (intent === "create") {
        await context.cloudflare.var.Repositories.user.insert({
            name,
            email,
            role,
            isActive
        });
        return json({ success: true });
    }

    if (intent === "edit") {
        const id = formData.get("id") as string;
        await context.cloudflare.var.Repositories.user.update(parseInt(id), {
            name,
            email,
            role,
            isActive
        });
        return json({ success: true });
    }
}

export default function UsersPage() {
    const { users } = useLoaderData<{ users: User[] }>();

    return (
        <div className="flex flex-col gap-4 p-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Users</CardTitle>
                        <AddUserDialog />
                    </div>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <p className="text-center text-gray-500">No users available</p>
                    ) : (
                        <div className="divide-y">
                            {users.map((user: User) => (
                                <div key={user.id} className="py-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">{user.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            Email: {user.email} |
                                            Role: {user.role} |
                                            Status: {user.isActive ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <EditUserDialog user={user}>
                                            <Button variant="ghost" size="icon" title="Edit user">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </EditUserDialog>
                                        <DeleteUserDialog id={user.id} name={user.name} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

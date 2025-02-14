import { useState, useEffect } from "react";
import { Form, useNavigation } from "@remix-run/react";
import type { User } from "@prtctyai/database";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface UserDialogProps {
    mode: "add" | "edit";
    user?: User;
    children?: React.ReactNode;
}

export function UserDialog({ mode, user, children }: UserDialogProps) {
    const [open, setOpen] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation.state === "idle" && open) {
            setOpen(false);
        }
    }, [navigation.state]);

    const title = mode === "add" ? "Add New User" : "Edit User";
    const description = mode === "add"
        ? "Enter the details for the new user."
        : "Modify the details for this user.";
    const submitText = mode === "add" ? "Add User" : "Save Changes";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ?? (
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <Form method="post" className="space-y-4">
                    <input type="hidden" name="intent" value={mode === "add" ? "create" : "edit"} />
                    {mode === "edit" && <input type="hidden" name="id" value={user?.id} />}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={mode === "edit" ? user?.name : undefined}
                            placeholder="Enter user name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={mode === "edit" ? user?.email : undefined}
                            placeholder="Enter email address"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            name="role"
                            defaultValue={mode === "edit" ? user?.role : "User"}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Super-Admin">Super Admin</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            className="h-4 w-4"
                            defaultChecked={mode === "edit" ? user?.isActive : true}
                        />
                        <Label htmlFor="isActive">Active</Label>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{submitText}</Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

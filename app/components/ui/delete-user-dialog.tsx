import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Form } from "@remix-run/react";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteUserDialogProps {
    id: number;
    name: string;
}

export function DeleteUserDialog({ id, name }: DeleteUserDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Delete user">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {name}? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <Form method="post" onSubmit={() => setOpen(false)}>
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="id" value={id} />
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="destructive">
                            Delete
                        </Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

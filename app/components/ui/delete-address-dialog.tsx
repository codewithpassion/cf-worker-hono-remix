import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "~/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface DeleteAddressDialogProps {
    name: string;
    address: string;
    id: number;
}

export function DeleteAddressDialog({ name, address, id }: DeleteAddressDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" title="Delete address">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Address</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {name} ({address})? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Form method="post">
                        <input type="hidden" name="id" value={id} />
                        <input type="hidden" name="intent" value="delete" />
                        <Button type="submit" variant="destructive">Delete</Button>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import { useState, useEffect } from "react";
import { Form, useNavigation } from "@remix-run/react";
import type { ServiceDays } from "packages/database/db/schema";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface EditTruckDialogProps {
    truck: {
        id: number;
        truck_id: string;
        type: "R" | "C";
        capacity: number;
        comment: string | null;
        isActive: boolean;
        serviceDays: ServiceDays[] | null;
    };
    children: React.ReactNode;
}

const SERVICE_DAYS: ServiceDays[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
];

export function EditTruckDialog({ truck, children }: EditTruckDialogProps) {
    const [open, setOpen] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation.state === "idle" && open) {
            setOpen(false);
        }
    }, [navigation.state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Truck</DialogTitle>
                    <DialogDescription>
                        Modify the details for this truck.
                    </DialogDescription>
                </DialogHeader>
                <Form method="post" className="space-y-4">
                    <input type="hidden" name="intent" value="edit" />
                    <input type="hidden" name="id" value={truck.id} />
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <select
                            id="type"
                            name="type"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                            required
                            defaultValue={truck.type}
                        >
                            <option value="R">Residential</option>
                            <option value="C">Commercial</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="truck_id">Truck ID</Label>
                        <Input
                            id="truck_id"
                            name="truck_id"
                            required
                            defaultValue={truck.truck_id}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                            id="capacity"
                            name="capacity"
                            type="number"
                            required
                            defaultValue={truck.capacity}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                className="h-4 w-4 rounded border-gray-300"
                                defaultChecked={truck.isActive}
                            />
                            <Label htmlFor="isActive">Active</Label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Service Days</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {SERVICE_DAYS.map((day) => (
                                <div key={day} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`serviceDay-${day}`}
                                        name="serviceDays"
                                        value={day}
                                        className="h-4 w-4 rounded border-gray-300"
                                        defaultChecked={truck.serviceDays?.includes(day) ?? false}
                                    />
                                    <Label htmlFor={`serviceDay-${day}`}>{day}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comment">Comment (Optional)</Label>
                        <Input
                            id="comment"
                            name="comment"
                            defaultValue={truck.comment || ""}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

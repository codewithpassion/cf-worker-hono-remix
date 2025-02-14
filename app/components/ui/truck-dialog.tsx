import { useState, useEffect } from "react";
import { Form, useNavigation } from "@remix-run/react";
import type { ServiceDays } from "packages/database/db/schema";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
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

interface TruckDialogProps {
    mode: "add" | "edit";
    trucks?: Array<{
        truck_id: string;
        type: "R" | "C";
        isActive: boolean;
    }>;
    truck?: {
        id: number;
        truck_id: string;
        type: "R" | "C";
        capacity: number;
        comment: string | null;
        isActive: boolean;
        serviceDays: ServiceDays[] | null;
    };
    children?: React.ReactNode;
}

const SERVICE_DAYS: ServiceDays[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
];

export function TruckDialog({ mode, trucks, truck, children }: TruckDialogProps) {
    const [selectedType, setSelectedType] = useState<"R" | "C">(truck?.type ?? "R");
    const [suggestedTruckId, setSuggestedTruckId] = useState(truck?.truck_id ?? "");
    const [capacity, setCapacity] = useState(truck?.capacity ?? 2);
    const [open, setOpen] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation.state === "idle" && open) {
            setOpen(false);
        }
    }, [navigation.state]);

    useEffect(() => {
        if (mode === "add") {
            // Set capacity based on truck type
            setCapacity(selectedType === "R" ? 2 : 3);

            // Filter trucks by type and extract numbers
            const typePrefix = selectedType + "-";
            const existingNumbers = trucks!
                .filter(truck => truck.truck_id.startsWith(typePrefix))
                .map(truck => parseInt(truck.truck_id.split('-')[1]));

            // Find the next available number
            const maxNumber = Math.max(0, ...existingNumbers);
            const nextNumber = (maxNumber + 1).toString().padStart(2, '0');

            // Set the suggested truck ID
            setSuggestedTruckId(`${typePrefix}${nextNumber}`);
        }
    }, [selectedType, trucks, mode]);

    const title = mode === "add" ? "Add New Truck" : "Edit Truck";
    const description = mode === "add"
        ? "Enter the details for the new truck."
        : "Modify the details for this truck.";
    const submitText = mode === "add" ? "Add Truck" : "Save Changes";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ?? (
                    <Button size="icon">
                        <Plus className="h-4 w-4" />
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
                    {mode === "edit" && <input type="hidden" name="id" value={truck?.id} />}
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <select
                            id="type"
                            name="type"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                            required
                            value={mode === "add" ? selectedType : undefined}
                            defaultValue={mode === "edit" ? truck?.type : undefined}
                            onChange={mode === "add" ? (e) => setSelectedType(e.target.value as "R" | "C") : undefined}
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
                            value={mode === "add" ? suggestedTruckId : undefined}
                            defaultValue={mode === "edit" ? truck?.truck_id : undefined}
                            onChange={mode === "add" ? (e) => setSuggestedTruckId(e.target.value) : undefined}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                            id="capacity"
                            name="capacity"
                            type="number"
                            required
                            value={mode === "add" ? capacity : undefined}
                            defaultValue={mode === "edit" ? truck?.capacity : undefined}
                            onChange={mode === "add" ? (e) => setCapacity(Number(e.target.value)) : undefined}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                className="h-4 w-4 rounded border-gray-300"
                                defaultChecked={mode === "add" ? true : truck?.isActive}
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
                                        defaultChecked={mode === "add" ? true : truck?.serviceDays?.includes(day) ?? false}
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
                            defaultValue={mode === "edit" ? truck?.comment || "" : ""}
                        />
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

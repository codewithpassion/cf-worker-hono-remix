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

interface AddAddressDialogProps {
    trucks: Array<{
        truck_id: string;
        type: "R" | "C";
        isActive: boolean;
    }>;
}

const SERVICE_DAYS: ServiceDays[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

export function AddAddressDialog({ trucks }: AddAddressDialogProps) {
    const [open, setOpen] = useState(false);
    const navigation = useNavigation();
    const [hasTimeWindow, setHasTimeWindow] = useState(false);
    const [hasGPS, setHasGPS] = useState(false);

    useEffect(() => {
        if (navigation.state === "idle" && open) {
            setOpen(false);
        }
    }, [navigation.state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon">
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new address.
                    </DialogDescription>
                </DialogHeader>
                <Form method="post" className="space-y-4">
                    <input type="hidden" name="intent" value="create" />

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="Customer name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            required
                            placeholder="Full address"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="visits">Visits</Label>
                            <Input
                                id="visits"
                                name="visits"
                                type="number"
                                required
                                min="1"
                                defaultValue="1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="allocatedTime">Time (minutes)</Label>
                            <Input
                                id="allocatedTime"
                                name="allocatedTime"
                                type="number"
                                required
                                min="1"
                                defaultValue="15"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                className="h-4 w-4 rounded border-gray-300"
                                defaultChecked={true}
                            />
                            <Label htmlFor="isActive">Active</Label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="truck_id">Assigned Truck (Optional)</Label>
                        <select
                            id="truck_id"
                            name="constraints.truck_id"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                        >
                            <option value="">Select a truck</option>
                            {trucks.filter(t => t.isActive).map((truck) => (
                                <option key={truck.truck_id} value={truck.truck_id}>
                                    {truck.truck_id} ({truck.type === 'R' ? 'Residential' : 'Commercial'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="serviceDay">Service Day (Optional)</Label>
                        <select
                            id="serviceDay"
                            name="constraints.serviceDay"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                        >
                            <option value="">Select a day</option>
                            {SERVICE_DAYS.map((day) => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="hasTimeWindow"
                                checked={hasTimeWindow}
                                onChange={(e) => setHasTimeWindow(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="hasTimeWindow">Has Time Window</Label>
                        </div>
                        {hasTimeWindow && (
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <Label htmlFor="timeWindowStart">Start Time</Label>
                                    <Input
                                        id="timeWindowStart"
                                        name="constraints.timeWindow.start"
                                        type="time"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="timeWindowEnd">End Time</Label>
                                    <Input
                                        id="timeWindowEnd"
                                        name="constraints.timeWindow.end"
                                        type="time"
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="hasGPS"
                                checked={hasGPS}
                                onChange={(e) => setHasGPS(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="hasGPS">Has GPS Coordinates</Label>
                        </div>
                        {hasGPS && (
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <Label htmlFor="latitude">Latitude</Label>
                                    <Input
                                        id="latitude"
                                        name="gps.lat"
                                        type="number"
                                        step="any"
                                        required
                                        placeholder="e.g. 41.8781"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="longitude">Longitude</Label>
                                    <Input
                                        id="longitude"
                                        name="gps.lng"
                                        type="number"
                                        step="any"
                                        required
                                        placeholder="e.g. -87.6298"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Add Address</Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

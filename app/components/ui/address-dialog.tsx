import { useState, useEffect } from "react";
import { Form, useNavigation } from "@remix-run/react";
import type { ServiceDays, AddressConstraints, MapPoint } from "packages/database/db/schema";
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
import { Map } from "./map";
import { MapsAutocomplete } from "./maps-autocomplete";
import { APIProvider } from "@vis.gl/react-google-maps";

interface AddressDialogProps {
    apiKey: string;
    trucks: Array<{
        truck_id: string;
        type: "R" | "C";
        isActive: boolean;
    }>;
    address?: {
        id: number;
        name: string;
        address: string;
        visits: number;
        allocatedTime: number;
        isActive: boolean;
        gps: MapPoint | null;
        constraints: AddressConstraints;
    };
    children?: React.ReactNode;
}

const SERVICE_DAYS: ServiceDays[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

export function AddressDialog({ address, trucks, children, apiKey }: AddressDialogProps) {
    const [open, setOpen] = useState(false);
    const navigation = useNavigation();
    const [hasTimeWindow, setHasTimeWindow] = useState(!!address?.constraints?.timeWindow);
    const [timeWindow, setTimeWindow] = useState({
        start: address?.constraints?.timeWindow?.start || '',
        end: address?.constraints?.timeWindow?.end || ''
    });
    const [gpsCoords, setGpsCoords] = useState<MapPoint | undefined>(address?.gps || undefined);
    const isEditing = !!address;

    useEffect(() => {
        if (navigation.state === "idle" && open) {
            setOpen(false);
        }
    }, [navigation.state]);

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
                    <DialogTitle>{isEditing ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Modify the details for this address.' : 'Enter the details for the new address.'}
                    </DialogDescription>
                </DialogHeader>
                <APIProvider apiKey={apiKey}>
                    <Form method="post" className="space-y-4">
                        <input type="hidden" name="intent" value={isEditing ? "edit" : "create"} />
                        {isEditing && <input type="hidden" name="id" value={address.id} />}

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="Customer name"
                                defaultValue={address?.name}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <input id='address' type="hidden" name="address" value={address?.address} />
                            <MapsAutocomplete address={address?.address} onPlaceSelect={(x) => {
                                console.log(x);
                                address!.address = x?.address || '';
                                document.getElementById('address')!.setAttribute('value', x?.address || '');
                                setGpsCoords({
                                    lat: x?.location?.lat || 0,
                                    lng: x?.location?.lng || 0
                                });
                            }}
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
                                    defaultValue={address?.visits ?? 1}
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
                                    defaultValue={address?.allocatedTime ?? 15}
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
                                    defaultChecked={address?.isActive ?? true}
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
                                defaultValue={address?.constraints?.truck_id || ""}
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
                                defaultValue={address?.constraints?.serviceDay || ""}
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
                                    onChange={(e) => {
                                        setHasTimeWindow(e.target.checked);
                                        if (!e.target.checked) {
                                            setTimeWindow({ start: '', end: '' });
                                        }
                                    }}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="hasTimeWindow">Time window constraint (Optional)</Label>
                            </div>
                            {hasTimeWindow && (
                                <>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <Label htmlFor="timeWindowStart">Start Time</Label>
                                            <Input
                                                id="timeWindowStart"
                                                type="time"
                                                required
                                                value={timeWindow.start}
                                                onChange={(e) => setTimeWindow(prev => ({
                                                    ...prev,
                                                    start: e.target.value
                                                }))}
                                            />
                                            <input
                                                type="hidden"
                                                name="constraints.timeWindow.start"
                                                value={timeWindow.start}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="timeWindowEnd">End Time</Label>
                                            <Input
                                                id="timeWindowEnd"
                                                type="time"
                                                required
                                                value={timeWindow.end}
                                                onChange={(e) => setTimeWindow(prev => ({
                                                    ...prev,
                                                    end: e.target.value
                                                }))}
                                            />
                                            <input
                                                type="hidden"
                                                name="constraints.timeWindow.end"
                                                value={timeWindow.end}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <Label htmlFor="latitude">Latitude</Label>
                                    <Input
                                        id="latitude"
                                        type="number"
                                        step="any"
                                        disabled
                                        placeholder="e.g. 41.8781"
                                        value={gpsCoords?.lat || ''}
                                    />
                                    <input
                                        type="hidden"
                                        name="gps.lat"
                                        value={gpsCoords?.lat || ''}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="longitude">Longitude</Label>
                                    <Input
                                        id="longitude"
                                        type="number"
                                        step="any"
                                        disabled
                                        placeholder="e.g. -87.6298"
                                        value={gpsCoords?.lng || ''}
                                    />
                                    <input
                                        type="hidden"
                                        name="gps.lng"
                                        value={gpsCoords?.lng || ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <Map
                            mapId="addressMap"
                            point={gpsCoords}
                        />

                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">{isEditing ? 'Save Changes' : 'Add Address'}</Button>
                        </DialogFooter>
                    </Form>
                </APIProvider>
            </DialogContent>
        </Dialog>
    );
}

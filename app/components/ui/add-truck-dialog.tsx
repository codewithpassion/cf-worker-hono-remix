import { useState, useEffect } from "react";
import { Form, useNavigation } from "@remix-run/react";
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

interface AddTruckDialogProps {
    trucks: Array<{
        truck_id: string;
        type: "R" | "C";
        isActive: boolean;
    }>;
}

export function AddTruckDialog({ trucks }: AddTruckDialogProps) {
    const [selectedType, setSelectedType] = useState<"R" | "C">("R");
    const [suggestedTruckId, setSuggestedTruckId] = useState("");
    const [open, setOpen] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation.state === "idle" && open) {
            setOpen(false);
        }
    }, [navigation.state]);

    useEffect(() => {
        // Filter trucks by type and extract numbers
        const typePrefix = selectedType + "-";
        const existingNumbers = trucks
            .filter(truck => truck.truck_id.startsWith(typePrefix))
            .map(truck => parseInt(truck.truck_id.split('-')[1]));

        // Find the next available number
        const maxNumber = Math.max(0, ...existingNumbers);
        const nextNumber = (maxNumber + 1).toString().padStart(2, '0');
        
        // Set the suggested truck ID
        setSuggestedTruckId(`${typePrefix}${nextNumber}`);
    }, [selectedType, trucks]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon">
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Truck</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new truck.
                    </DialogDescription>
                </DialogHeader>
                <Form method="post" className="space-y-4">
                    <input type="hidden" name="intent" value="create" />
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <select 
                            id="type" 
                            name="type" 
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                            required
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as "R" | "C")}
                        >
                            <option value="R">Residemtial</option>
                            <option value="C">Comercial</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="truck_id">Truck ID</Label>
                        <Input 
                            id="truck_id" 
                            name="truck_id" 
                            required 
                            value={suggestedTruckId}
                            onChange={(e) => setSuggestedTruckId(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input 
                            id="capacity" 
                            name="capacity" 
                            type="number" 
                            required 
                        />
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
                        <Label htmlFor="comment">Comment (Optional)</Label>
                        <Input id="comment" name="comment" />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Truck</Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

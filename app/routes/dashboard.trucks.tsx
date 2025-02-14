import { type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TruckDialog } from "~/components/ui/truck-dialog";
import { Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DeleteTruckDialog } from "~/components/ui/delete-truck-dialog";

export async function loader({ context }: LoaderFunctionArgs) {
    const trucks = await context.cloudflare.var.Repositories.trucks.getAll();
    return { trucks };
}

export async function action({ request, context }: ActionFunctionArgs) {
    const formData = await request.formData();
    const truck_id = formData.get("truck_id") as string;
    const type = formData.get("type") as "R" | "C";
    const capacity = formData.get("capacity") as string;
    const comment = formData.get("comment") as string;
    const isActive = formData.get("isActive") === "on";

    const intent = formData.get("intent");

    if (intent === "delete") {
        const id = formData.get("id") as string;
        await context.cloudflare.var.Repositories.trucks.delete(parseInt(id));
        return { success: true };
    }

    if (intent === "create") {
        await context.cloudflare.var.Repositories.trucks.insert({
            truck_id,
            type,
            capacity: parseInt(capacity),
            comment: comment || null,
            isActive
        });
        return { success: true };
    }

    if (intent === "edit") {
        const id = formData.get("id") as string;
        await context.cloudflare.var.Repositories.trucks.update(parseInt(id), {
            truck_id,
            type,
            capacity: parseInt(capacity),
            comment: comment || null,
            isActive
        });
        return { success: true };
    }

    return { success: false }
}

export default function TrucksPage() {
    const { trucks } = useLoaderData<typeof loader>();
    const [filter, setFilter] = useState<'all' | 'R' | 'C'>('all');

    const filteredTrucks = trucks.filter(truck =>
        filter === 'all' ? true : truck.type === filter
    );

    return (
        <div className="flex flex-col gap-4 p-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <CardTitle>Trucks</CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant={filter === 'all' ? "default" : "outline"}
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={filter === 'R' ? "default" : "outline"}
                                    onClick={() => setFilter('R')}
                                >
                                    Residential
                                </Button>
                                <Button
                                    variant={filter === 'C' ? "default" : "outline"}
                                    onClick={() => setFilter('C')}
                                >
                                    Commercial
                                </Button>
                            </div>
                        </div>
                        <TruckDialog mode="add" trucks={trucks} />
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredTrucks.length === 0 ? (
                        <p className="text-center text-gray-500">No trucks available</p>
                    ) : (
                        <div className="divide-y">
                            {filteredTrucks.map((truck) => (
                                <div key={truck.id} className="py-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">Truck {truck.truck_id}</h3>
                                        <p className="text-sm text-gray-500">
                                            Type: {truck.type === 'R' ? 'Residental' : 'commercial'} |
                                            Capacity: {truck.capacity} |
                                            Status: {truck.isActive ? 'Active' : 'Inactive'} |
                                            Service Days: {truck.serviceDays?.length ? truck.serviceDays.join(', ') : 'None'}
                                            {truck.comment && ` | Note: ${truck.comment}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <TruckDialog mode="edit" truck={truck}>
                                            <Button variant="ghost" size="icon" title="Edit truck">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TruckDialog>
                                        <DeleteTruckDialog truckId={truck.truck_id} id={truck.id} />
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

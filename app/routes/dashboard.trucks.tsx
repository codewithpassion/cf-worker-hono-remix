import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Form } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AddTruckDialog } from "~/components/ui/add-truck-dialog";
import { EditTruckDialog } from "~/components/ui/edit-truck-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DeleteTruckDialog } from "~/components/ui/delete-truck-dialog";

export async function loader({ context }: LoaderFunctionArgs) {
    const trucks = await context.cloudflare.var.Repositories.trucks.getAll();
    return json({ trucks });
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
        return json({ success: true });
    }

    if (intent === "create") {
        await context.cloudflare.var.Repositories.trucks.insert({
            truck_id,
            type,
            capacity: parseInt(capacity),
            comment: comment || null,
            isActive
        });
        return json({ success: true });
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
        return json({ success: true });
    }
}

export default function TrucksPage() {
    const { trucks } = useLoaderData<typeof loader>();

    return (
        <div className="flex flex-col gap-4 p-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Trucks</CardTitle>
                        <AddTruckDialog trucks={trucks} />
                    </div>
                </CardHeader>
                <CardContent>
                    {trucks.length === 0 ? (
                        <p className="text-center text-gray-500">No trucks available</p>
                    ) : (
                        <div className="divide-y">
                            {trucks.map((truck) => (
                            <div key={truck.id} className="py-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">Truck {truck.truck_id}</h3>
                                    <p className="text-sm text-gray-500">
                                        Type: {truck.type === 'R' ? 'Residental' : 'Comercial'} | 
                                        Capacity: {truck.capacity} |
                                        Status: {truck.isActive ? 'Active' : 'Inactive'}
                                        {truck.comment && ` | Note: ${truck.comment}`}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <EditTruckDialog truck={truck}>
                                        <Button variant="ghost" size="icon" title="Edit truck">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </EditTruckDialog>
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

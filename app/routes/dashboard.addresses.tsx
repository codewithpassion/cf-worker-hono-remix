import { type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Pencil } from "lucide-react";
import { AddAddressDialog } from "~/components/ui/add-address-dialog";
import { EditAddressDialog } from "~/components/ui/edit-address-dialog";
import { DeleteAddressDialog } from "~/components/ui/delete-address-dialog";

export async function loader({ context }: LoaderFunctionArgs) {
    const [addresses, trucks] = await Promise.all([
        context.cloudflare.var.Repositories.addresses.getAll(),
        context.cloudflare.var.Repositories.trucks.getAll()
    ]);
    return { addresses, trucks };
}

export async function action({ request, context }: ActionFunctionArgs) {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const visits = formData.get("visits") as string;
    const allocatedTime = formData.get("allocatedTime") as string;
    const isActive = formData.get("isActive") === "on";
    const gps = formData.get("gps") ? JSON.parse(formData.get("gps") as string) : null;
    const constraints = formData.get("constraints") ? JSON.parse(formData.get("constraints") as string) : {};

    const intent = formData.get("intent");

    if (intent === "delete") {
        const id = formData.get("id") as string;
        await context.cloudflare.var.Repositories.addresses.delete(parseInt(id));
        return { success: true };
    }

    if (intent === "create") {
        await context.cloudflare.var.Repositories.addresses.insert({
            name,
            address,
            visits: parseInt(visits),
            allocatedTime: parseFloat(allocatedTime),
            gps,
            constraints,
            isActive
        });
        return { success: true };
    }

    if (intent === "edit") {
        const id = formData.get("id") as string;
        await context.cloudflare.var.Repositories.addresses.update(parseInt(id), {
            name,
            address,
            visits: parseInt(visits),
            allocatedTime: parseFloat(allocatedTime),
            gps,
            constraints,
            isActive
        });
        return { success: true };
    }

    return { success: false }
}

export default function AddressesPage() {
    const { addresses, trucks } = useLoaderData<typeof loader>();
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const filteredAddresses = addresses.filter(address =>
        filter === 'all' ? true :
            filter === 'active' ? address.isActive :
                !address.isActive
    );

    return (
        <div className="flex flex-col gap-4 p-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <CardTitle>Addresses</CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant={filter === 'all' ? "default" : "outline"}
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={filter === 'active' ? "default" : "outline"}
                                    onClick={() => setFilter('active')}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={filter === 'inactive' ? "default" : "outline"}
                                    onClick={() => setFilter('inactive')}
                                >
                                    Inactive
                                </Button>
                            </div>
                        </div>
                        <AddAddressDialog trucks={trucks} />
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredAddresses.length === 0 ? (
                        <p className="text-center text-gray-500">No addresses available</p>
                    ) : (
                        <div className="divide-y">
                            {filteredAddresses.map((address) => (
                                <div key={address.id} className="py-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">{address.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            Address: {address.address} |
                                            Visits: {address.visits} |
                                            Time: {address.allocatedTime} minutes |
                                            Status: {address.isActive ? 'Active' : 'Inactive'}
                                            {address.constraints?.truck_id && ` | Truck: ${address.constraints.truck_id}`}
                                            {address.constraints?.serviceDay && ` | Service Day: ${address.constraints.serviceDay}`}
                                            {address.constraints?.timeWindow && ` | Time Window: ${address.constraints.timeWindow.start}-${address.constraints.timeWindow.end}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <EditAddressDialog
                                            address={{
                                                ...address,
                                                constraints: address.constraints || {}
                                            }}
                                            trucks={trucks}
                                        >
                                            <Button variant="ghost" size="icon" title="Edit address">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </EditAddressDialog>
                                        <DeleteAddressDialog
                                            name={address.name}
                                            address={address.address}
                                            id={address.id}
                                        />
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

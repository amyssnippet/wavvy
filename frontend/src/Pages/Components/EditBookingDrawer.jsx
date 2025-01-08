import React from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export function EditBookingDrawer({ open, onClose, appointment }) {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: appointment || {},
    });

    React.useEffect(() => {
        if (appointment) {
            reset(appointment); // Prefill the form with the selected appointment details
        }
    }, [appointment, reset]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/appointments/${appointment.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Appointment updated successfully!");
                onClose();
            } else {
                alert("Failed to update appointment.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred.");
        }
    };

    return (
        <Drawer open={open} onOpenChange={onClose}>
            <DrawerContent className="flex flex-col h-[90vh] p-6">
                <DrawerHeader>
                    <DrawerTitle className="text-xl font-semibold">
                        Edit Appointment
                    </DrawerTitle>
                    <DrawerClose asChild>
                        <Button variant="ghost">Close</Button>
                    </DrawerClose>
                </DrawerHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 dispay-flex">
                    <Input {...register("client_appointments.client_name")} placeholder="Customer Name" />
                    <Input {...register("client_appointments.client_phone")} placeholder="Phone Number" />
                    <Input {...register("status")} placeholder="Status" />
                    <Input {...register("appointment_date")} placeholder="Date" type="date" />
                    <Input {...register("appointment_time")} placeholder="Time" type="time" />
                    <div className="flex justify-end">
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    );
}

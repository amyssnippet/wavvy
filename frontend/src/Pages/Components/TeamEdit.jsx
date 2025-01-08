import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EditTeamDrawer({
  open,
  onOpenChange,
  teamMember,
  updateTeamMember,
}) {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      accessType: "Admin",
    },
  });

  const { reset } = form;

  // Update form values whenever teamMember changes
  useEffect(() => {
    if (teamMember) {
      reset({
        firstName: teamMember.first_name || "",
        lastName: teamMember.last_name || "",
        phoneNumber: teamMember.phone_number || "",
        email: teamMember.member_email || "",
        accessType: teamMember.access_type || "Admin",
      });
    }
  }, [teamMember, reset]);

  const onSubmit = async (data) => {
    const updatedFields = {};

    if (data.firstName !== teamMember.first_name) updatedFields.first_name = data.firstName;
    if (data.lastName !== teamMember.last_name) updatedFields.last_name = data.lastName;
    if (data.phoneNumber !== teamMember.phone_number) updatedFields.phone_number = data.phoneNumber;
    if (data.email !== teamMember.member_email) updatedFields.member_email = data.email;
    if (data.accessType !== teamMember.access_type) updatedFields.access_type = data.accessType;

    if (Object.keys(updatedFields).length > 0) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/team/${teamMember.id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFields),
        });

        if (response.ok) {
          const updatedMember = await response.json();
          updateTeamMember(updatedMember);
          form.reset();
          onOpenChange(false);
          alert("Team member updated successfully!");
        } else {
          alert("Failed to update team member. Please try again.");
        }
      } catch (error) {
        console.error("Error updating team member:", error);
        alert("An error occurred while updating the team member.");
      }
    } else {
      alert("No changes were made.");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex flex-col h-[90vh] p-6">
        <div className="flex items-center justify-between mb-6">
          <DrawerHeader className="p-0">
            <DrawerTitle className="text-xl font-semibold">Edit Team Member</DrawerTitle>
          </DrawerHeader>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-0000" {...field} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField
                control={form.control}
                name="accessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select access type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@company.com" {...field} />
                </FormControl>
              </FormItem>
            )} />
            <div className="flex justify-end gap-4 mt-6">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
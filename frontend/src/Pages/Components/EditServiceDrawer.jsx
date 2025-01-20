import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { APIURL } from "@/url.config";

export default function EditServiceDrawer({
  open,
  onOpenChange,
  service,
  onServiceUpdated,
}) {
  const [categories, setCategories] = useState([]);
  const form = useForm({
    defaultValues: {
      serviceName: "",
      serviceType: "",
      durationInMins: "",
      price: "",
      categoryId: "",
    },
  });

  const businessId = localStorage.getItem("businessId");

  useEffect(() => {
    // Prefill the form if a service is provided
    if (service) {
      form.reset({
        serviceName: service.service_name || "",
        serviceType: service.service_type || "",
        durationInMins: service.duration_in_mins?.toString() || "",
        price: service.price?.toString() || "",
        categoryId: service.category || "",
      });
    }
  }, [service, form]);

  useEffect(() => {
    // Fetch categories for dropdown
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${APIURL}/api/business/${businessId}`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.business_categories || []);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (businessId) {
      fetchCategories();
    }
  }, [businessId]);

  const onSubmit = async (data) => {
    const payload = {
      service_name: data.serviceName,
      service_type: data.serviceType,
      duration_in_mins: parseInt(data.durationInMins),
      price: parseFloat(data.price),
      category: data.categoryId,
      business_id: businessId
    };

    try {
      const response = await fetch(`${APIURL}/api/services/${service?.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedService = await response.json();
        alert("Service updated successfully!");
        form.reset(); // Clear the form
        onOpenChange(false); // Close the drawer
        onServiceUpdated(updatedService); // Update the service list in parent
      } else {
        const errorData = await response.json();
        alert("Failed to update service: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error updating service:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Add-on">Add-on</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="durationInMins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (mins)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter duration in minutes"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-black">
                      {categories.map((category) => (
                        <SelectItem
                          className="text-black"
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Update Service
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

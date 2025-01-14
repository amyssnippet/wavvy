import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Navbar } from "../Components/Navbar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export default function Services() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    // Fetch data for services, packages, and categories
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/business/1`); // Replace `1` with dynamic businessId
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setServices(data.business_services || []);
        setPackages(data.business_packages || []);
        setCategories([
          { id: 0, name: "All Categories" },
          ...data.business_categories,
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  return (
    <div>
      <Navbar />
      <div className="p-8 bg-white">
        <div className="flex items-center mb-4 justify-between py-8">
          <div className="flex flex-col mb-7">
            <span className="text-black font-bold text-3xl">Service Menu</span>
            <span className="text-gray-500 font-thin text-xl">
              View and manage the services offered by your business
            </span>
          </div>
          <div className="space-x-4">
            <Button
              variant="secondary"
              className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 px-10 rounded-lg"
              onClick={toggleDrawer}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="flex flex-row space-x-4 outline outline-1 outline-gray-200 rounded-md px-2">
          <div className="bg-white rounded-md w-full flex items-center space-x-4 p-2">
            <Input
              type="text"
              placeholder="Search"
              className="flex-grow p-1 rounded-md"
            />
            <Input
              type="date"
              placeholder="Month to date"
              className="flex-grow p-1 rounded-md"
            />
            <Input
              type="text"
              placeholder="Filters"
              className="flex-grow p-1 rounded-md"
            />
          </div>
        </div>

        <div className="flex mt-10">
          {/* Sidebar */}
          <div className="w-1/4 p-4 bg-gray-100">
            {/* Categories Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Categories</h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Button
                      variant={
                        selectedCategory === category.name ? "solid" : "ghost"
                      }
                      className="w-full justify-between"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Packages Section */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Packages</h2>
              <ul className="space-y-2">
                {packages.map((pkg) => (
                  <li key={pkg.id}>
                    <Button variant="ghost" className="w-full justify-between">
                      {pkg.package_name}
                      <span className="bg-gray-300 px-2 py-1 rounded-full">
                        ₹{pkg.package_price}
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-3/4 p-4">
            <h1 className="text-xl font-bold mb-4">
              {selectedCategory === "All" ? "All Services" : selectedCategory}
            </h1>
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="flex justify-between items-center p-4"
                >
                  <div>
                    <h3 className="font-medium">{service.service_name}</h3>
                    <p className="text-sm text-gray-500">
                      {service.duration_in_mins} mins
                    </p>
                  </div>
                  <p className="text-lg font-semibold">₹{service.price}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer for Adding Items */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="flex bg-black justify-center items-center border-none">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-md p-6 m-10">
              <DrawerHeader>
                <DrawerTitle>Add New Item</DrawerTitle>
                <DrawerDescription>
                  Use this form to add a new service, package, or category.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button className="bg-purple-600" onClick={toggleDrawer}>
                  Submit
                </Button>
                <DrawerClose>
                  <Button variant="outline" onClick={toggleDrawer}>
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

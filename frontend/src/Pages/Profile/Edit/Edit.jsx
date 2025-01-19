import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { APIURL } from "@/url.config";

export function ProfileEdit({ onSave, onCancel }) {
  const [profile, setProfile] = useState(null); // State to hold profile data
  const [editedProfile, setEditedProfile] = useState(null); // State for editable profile
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null); // File for the new image
  const [isSaving, setIsSaving] = useState(false); // Saving state
  const businessId = localStorage.getItem("businessId");
  const url = `${APIURL}/api/business/${businessId}/`; // Replace with your API endpoint

  // Prefetch the profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setEditedProfile(data); // Prefill form with fetched data
          setPreviewImage(data.profile_img); // Set initial preview image
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [url]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file); // Store the file to send in the request
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Update the preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Use FormData to handle multipart form-data
      const formData = new FormData();
      formData.append("owner_name", editedProfile.owner_name);
      formData.append("salon_name", editedProfile.salon_name);
      formData.append("phone_number", editedProfile.phone_number);
      formData.append("owner_email", editedProfile.owner_email);
      formData.append("gst", editedProfile.gst);
      formData.append("salon_description", editedProfile.salon_description);

      // Append the profile image if a new one is selected
      if (selectedImageFile) {
        formData.append("profile_img", selectedImageFile);
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Add token if needed
        },
        body: formData, // Send FormData as the body
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        onSave(updatedProfile); // Pass updated data back to parent
      } else {
        console.error("Failed to update profile:", await response.text());
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>; // Loading state while fetching profile
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={previewImage || undefined}
            alt={editedProfile.owner_name}
          />
          <AvatarFallback>{editedProfile.owner_name.charAt(0)}</AvatarFallback>
        </Avatar>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="owner_name">Owner Name</Label>
          <Input
            id="owner_name"
            name="owner_name"
            value={editedProfile.owner_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="salon_name">Salon Name</Label>
          <Input
            id="salon_name"
            name="salon_name"
            value={editedProfile.salon_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={editedProfile.phone_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="owner_email">Email</Label>
          <Input
            id="owner_email"
            name="owner_email"
            type="email"
            value={editedProfile.owner_email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="gst">GST</Label>
          <Input
            id="gst"
            name="gst"
            value={editedProfile.gst}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="salon_description">Salon Description</Label>
        <Textarea
          id="salon_description"
          name="salon_description"
          value={editedProfile.salon_description}
          onChange={handleChange}
          rows={4}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

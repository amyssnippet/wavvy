import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileEdit({ profile, onSave, onCancel }) {
  const [editedProfile, setEditedProfile] = useState(profile);
  const [previewImage, setPreviewImage] = useState(profile.profile_img);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditedProfile((prev) => ({ ...prev, profile_img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedProfile);
  };

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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}

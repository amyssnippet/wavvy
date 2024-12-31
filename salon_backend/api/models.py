import os
from django.conf import settings
from mongoengine import Document, StringField, EmailField, ListField, IntField, DateTimeField, FileField, DateField, ReferenceField, BooleanField, ValidationError

class Client(Document):
    client_name = StringField(required=True)
    client_type = StringField(
        required=True,
        choices=["Regular","Premium","Corporate","Walk-in"],
    )
    client_email = EmailField(required=True, max_length=40, unique=True)
    client_phone = StringField(required=True, unique=True)
    client_dob = DateField(required=False)
    client_gender = StringField(
        required=True,
        choices=["Male","Female","Rather Not to Say"],
    )
    appointment_history = ListField(ReferenceField('Appointment'))


class Services(Document):
    service_name = StringField(required=True)
    service_type = StringField(required=True, choices=["Basic", "Premium", "Add-on"])
    menu_category = StringField()
    duration_in_mins = IntField(min_value=10, required=True)
    price = IntField(min_value=0, required=True)

class Business(Document):
    
    def validate_image_size(file):
        max_size = 2 * 1024 * 1024
        if file.size > max_size:
            raise ValidationError("File size exceeds the 2 MB limit.")

    
    profile_img = FileField(required=False, validation=validate_image_size)
    owner_name = StringField(required=True)
    phone_number = StringField(required=True)
    salon_name = StringField(required=True, unique=True)
    owner_email = EmailField(required=True, unique=True)
    gst = StringField(required=False, unique=True)
    # salon_location = 
    salon_description = StringField(required=False)
    
    def save_image(self, image_file):
        """
        Save the profile image with the MongoDB ID as the filename.
        """
        if not self.id:
            self.save()  # Save the document first to generate an ID

        model_dir = os.path.join(settings.MEDIA_ROOT, "business")
        os.makedirs(model_dir, exist_ok=True)  # Create the directory if it doesn't exist

        # Use the MongoDB ID as the filename
        file_extension = os.path.splitext(image_file.name)[1]
        image_path = os.path.join(model_dir, f"{str(self.id)}{file_extension}")

        # Save the image file
        with open(image_path, "wb") as f:
            f.write(image_file.read())

        # Store the relative path in the profile_img field
        self.profile_img = os.path.relpath(image_path, settings.MEDIA_ROOT)
        self.save()

class TeamMember(Document):
    profile_img = StringField(required=False,null=True)
    member_name = StringField(required=True)
    phone_number = StringField(required=True, unique=True)
    member_email = EmailField(required=False, unique=True)
    date_of_joining = DateField()
    access_type = StringField(
        required=True,
        choices=["Super Admin", "Admin"],
    )
    is_available = BooleanField(default=True)

class Customer(Document):
    customer_name = StringField(required=True)
    customer_phone = StringField(required=True, unique=True)
    customer_reviews = StringField(
        required=True,
        choices=["Good","Bad"],
    )
    booked_at = DateField(required=True)
    scheduled_date = DateTimeField(required=True)
    
class Appointment(Document):
    select_service = ListField(ReferenceField(Services))
    select_staff = ReferenceField(TeamMember, required=False)
    customer = ReferenceField(Client, required=True)
    appointment_date = DateField(required=True)
    appointment_time = DateTimeField(required=True)
    status = StringField(
        required=True,
        choices=["Booked","Confirmed","Cancelled","Completed"],
    )
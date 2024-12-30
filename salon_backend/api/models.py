from mongoengine import Document, StringField, EmailField, ListField, IntField, DateTimeField, FileField, DateField, ReferenceField, BooleanField

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
    owner_name = StringField(required=True)
    phone_number = StringField(required=True)
    salon_name = StringField(required=True, unique=True)
    owner_email = EmailField(required=True, unique=True)
    gst = StringField(required=False, unique=True)
    # salon_location = 
    salon_description = StringField(required=False)

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
    appointment_date = DateTimeField(required=True)
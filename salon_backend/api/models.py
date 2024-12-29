from mongoengine import Document, StringField, EmailField, ListField, EmbeddedDocument, EmbeddedDocumentField, IntField, DateTimeField, FileField, DateField

class Client(Document):
    client_name = StringField(required=True)
    client_type = StringField(
        required=True,
        choices=["Regular","Premium","Corporate","Walk-in"],
    )
    client_email = EmailField(required=True, max_length=40)
    client_phone = StringField(required=True)
    client_dob = DateField(required=False)
    client_gender = StringField(
        required=True,
        choices=["Male","Female","Rather Not to Say"],
    )


class Services(EmbeddedDocument):
    service_name = StringField(required=True)
    service_type = StringField(required=True, choices=["Basic", "Premium", "Add-on"])
    menu_category = StringField()
    duration_in_mins = IntField(min_value=10, required=True)

class Business(Document):
    owner_name = StringField(required=True)
    phone_number = StringField(required=True)
    salon_name = StringField(required=True, unique=True)
    owner_email = EmailField(required=True, unique=True)
    gst = StringField(required=False)
    # salon_location = 
    salon_description = StringField(required=False)
    salon_services = ListField(EmbeddedDocumentField(Services))

class TeamMember(EmbeddedDocument):
    profile_img = FileField(required=False)
    member_name = StringField(required=True)
    phone_number = StringField(required=True)
    member_email = EmailField(required=False)
    date_of_joining = DateField()
    access_type = StringField(
        required=True,
        choices=["Super Admin", "Admin"],
    )

class Customer(Document):
    customer_name = StringField(required=True)
    customer_phone = StringField(required=True)
    customer_reviews = StringField(
        required=True,
        choices=["Good","Bad"],
    )
    services = ListField(
        EmbeddedDocumentField(Services),
        required=True
    )
    booked_at = DateField(required=True)
    scheduled_date = DateTimeField(required=True)

class Booking(Document):
    booking_service = ListField(
        EmbeddedDocumentField(Services),
        required=True)
    assign_staff = ListField(EmbeddedDocumentField(TeamMember), required=True)
    client = ListField(EmbeddedDocumentField(Client), required=True)
    created_at = DateTimeField(required=True)



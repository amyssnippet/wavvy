from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import random
from django.contrib.auth.hashers import make_password

# Validation for image size
def validate_image_size(file):
    max_size = 2 * 1024 * 1024  # 2 MB
    if file.size > max_size:
        raise ValidationError("File size exceeds the 2 MB limit.")

class Business(models.Model):
    password = models.CharField(max_length=128, blank=True, null=True)
    phone_number = models.CharField(max_length=15, unique=True)
    owner_name = models.CharField(max_length=100)
    salon_name = models.CharField(max_length=100)
    owner_email = models.EmailField()
    gst = models.CharField(max_length=15, blank=True, null=True)
    salon_description = models.TextField(blank=True)
    profile_img = models.ImageField(upload_to="profiles/", null=True, blank=True)
    team_members = models.ManyToManyField('TeamMember', blank=True, related_name="businesses")
    services = models.ManyToManyField('Services', blank=True, related_name="businesses")
    appointments = models.ManyToManyField('Appointment', blank=True, related_name="businesses")
    clients = models.ManyToManyField('Client', blank=True, related_name="businesses")
    categories = models.ManyToManyField('ServiceCategory', blank=True, related_name="businesses")
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    def __str__(self):
        return self.salon_name

class ServiceCategory(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True, max_length=255)

    def __str__(self):
        return self.name

class Services(models.Model):
    service_name = models.CharField(max_length=50)
    service_type = models.CharField(
        max_length=50,
        choices=[("Basic", "Basic"), ("Premium", "Premium"), ("Add-on", "Add-on")]
    )
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="services")
    duration_in_mins = models.PositiveIntegerField()
    price = models.PositiveIntegerField()

    def __str__(self):
        return self.service_name

class Client(models.Model):
    client_name = models.CharField(max_length=255)
    client_type = models.CharField(
        max_length=50,
        choices=[("Regular", "Regular"), ("Premium", "Premium"), ("Corporate", "Corporate"), ("Walk-in", "Walk-in")]
    )
    client_email = models.EmailField(max_length=40, unique=True)
    client_phone = models.CharField(max_length=15, unique=True)
    client_dob = models.DateField(null=True, blank=True)
    client_gender = models.CharField(
        max_length=20,
        choices=[("Male", "Male"), ("Female", "Female"), ("Rather Not to Say", "Rather Not to Say")]
    )

    def __str__(self):
        return self.client_name

class TeamMember(models.Model):
    profile_img = models.ImageField(upload_to="team_members", null=True, blank=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, unique=True)
    member_email = models.EmailField(unique=True)
    date_of_joining = models.DateField()
    access_type = models.CharField(
        max_length=50,
        choices=[("Super Admin", "Super Admin"), ("Admin", "Admin")]
    )
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Appointment(models.Model):
    services = models.ManyToManyField(Services, related_name="appointments")
    staff = models.ForeignKey(TeamMember, on_delete=models.SET_NULL, null=True, blank=True, related_name="appointments")
    client_appointments = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="client_appointments")
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    pay_mode = models.CharField(
        choices=[("Online", "Online"), ("Offline", "Offline")],
        default="Offline",
        max_length=10
    )

    def __str__(self):
        return f"Appointment for {self.client_appointments.client_name} on {self.appointment_date}"

class OTP(models.Model):
    phone_number = models.CharField(max_length=15, unique=True)
    otp = models.CharField(max_length=4)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_otp(self):
        self.otp = str(random.randint(1000, 9999))
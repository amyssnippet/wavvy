from django.db import models
from django.core.exceptions import ValidationError
import os
from django.conf import settings


def validate_image_size(file):
    max_size = 2 * 1024 * 1024
    if file.size > max_size:
        raise ValidationError("File size exceeds the 2 MB limit.")


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
    appointment_history = models.ManyToManyField('Appointment', blank=True)

    def __str__(self):
        return self.client_name


class Services(models.Model):
    service_name = models.CharField(max_length=255)
    service_type = models.CharField(
        max_length=50,
        choices=[("Basic", "Basic"), ("Premium", "Premium"), ("Add-on", "Add-on")]
    )
    menu_category = models.CharField(max_length=255, null=True, blank=True)
    duration_in_mins = models.PositiveIntegerField()
    price = models.PositiveIntegerField()

    def __str__(self):
        return self.service_name


class Business(models.Model):
    profile_img = models.ImageField(upload_to="business", validators=[validate_image_size], null=True, blank=True)
    owner_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, unique=True)
    salon_name = models.CharField(max_length=255, unique=True)
    owner_email = models.EmailField(unique=True)
    gst = models.CharField(max_length=50, null=True, blank=True, unique=True)
    salon_description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.salon_name


class TeamMember(models.Model):
    profile_img = models.ImageField(upload_to="team_members", null=True, blank=True)
    member_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, unique=True)
    member_email = models.EmailField(unique=True)
    date_of_joining = models.DateField()
    access_type = models.CharField(
        max_length=50,
        choices=[("Super Admin", "Super Admin"), ("Admin", "Admin")]
    )
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.member_name


class Appointment(models.Model):
    select_service = models.ManyToManyField(Services)
    select_staff = models.ForeignKey(TeamMember, on_delete=models.SET_NULL, null=True, blank=True)
    customer = models.ForeignKey(Client, on_delete=models.CASCADE)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(
        max_length=50,
        choices=[("Booked", "Booked"), ("Confirmed", "Confirmed"), ("Cancelled", "Cancelled"), ("Completed", "Completed")]
    )

    def __str__(self):
        return f"Appointment for {self.customer.client_name} on {self.appointment_date}"

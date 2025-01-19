# Generated by Django 5.1.4 on 2025-01-19 11:06

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0041_appointment_packages"),
    ]

    operations = [
        migrations.AlterField(
            model_name="business",
            name="phone_number",
            field=models.CharField(max_length=20, unique=True),
        ),
        migrations.AlterField(
            model_name="business",
            name="profile_img",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to="profiles/",
                validators=[api.models.validate_image_size],
            ),
        ),
    ]
# Generated by Django 5.1.4 on 2025-01-12 02:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0031_appointment_total_price"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="appointment",
            name="total_price",
        ),
    ]
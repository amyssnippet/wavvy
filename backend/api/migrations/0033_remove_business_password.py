# Generated by Django 5.1.4 on 2025-01-12 04:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0032_remove_appointment_total_price"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="business",
            name="password",
        ),
    ]
# Generated by Django 5.1.4 on 2025-01-11 02:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0026_services_business"),
    ]

    operations = [
        migrations.AlterField(
            model_name="services",
            name="category",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="service",
                to="api.servicecategory",
            ),
        ),
        migrations.CreateModel(
            name="Packages",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("package_name", models.CharField(max_length=50)),
                ("package_duration_in_mins", models.PositiveIntegerField()),
                ("package_price", models.PositiveIntegerField()),
                (
                    "business",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="business_packages",
                        to="api.business",
                    ),
                ),
            ],
        ),
    ]

# Generated by Django 5.1.4 on 2025-01-10 14:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0024_alter_teammember_business"),
    ]

    operations = [
        migrations.RenameField(
            model_name="business",
            old_name="team_members",
            new_name="related_team_members",
        ),
    ]
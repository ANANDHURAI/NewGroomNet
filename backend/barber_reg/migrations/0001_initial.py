# Generated by Django 5.2.1 on 2025-06-20 05:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BarberRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('licence', models.FileField(blank=True, null=True, upload_to='documents/licences/')),
                ('certificate', models.FileField(blank=True, null=True, upload_to='documents/certificates/')),
                ('profile_image', models.ImageField(blank=True, null=True, upload_to='barber_profiles/')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending', max_length=20)),
                ('registration_step', models.CharField(choices=[('personal_details', 'Personal Details'), ('documents_uploaded', 'Documents Uploaded'), ('under_review', 'Under Review'), ('completed', 'Completed')], default='personal_details', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('admin_comment', models.TextField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='barber_request', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

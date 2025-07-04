# Generated by Django 5.2.1 on 2025-06-26 08:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('customersite', '0002_booking_booking_type_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('is_read', models.BooleanField(default=False)),
                ('booking', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chat_messages', to='customersite.booking')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['timestamp'],
            },
        ),
    ]

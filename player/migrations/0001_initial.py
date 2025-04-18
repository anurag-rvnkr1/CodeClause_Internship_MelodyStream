# Generated by Django 4.2.10 on 2025-04-05 17:28

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('artist', models.CharField(blank=True, max_length=255, null=True)),
                ('album', models.CharField(blank=True, max_length=255, null=True)),
                ('file_path', models.CharField(max_length=1000)),
                ('duration', models.IntegerField(default=0)),
            ],
        ),
    ]

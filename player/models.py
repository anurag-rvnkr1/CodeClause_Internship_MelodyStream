from django.db import models

class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255, blank=True, null=True)
    album = models.CharField(max_length=255, blank=True, null=True)
    file_path = models.CharField(max_length=1000)
    duration = models.IntegerField(default=0)  # in seconds
    
    def __str__(self):
        return self.title
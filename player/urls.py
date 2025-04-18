from django.urls import path
from . import views

app_name = 'player'

urlpatterns = [
    path('', views.index, name='index'),
    path('songs-in-folder/', views.songs_in_folder, name='songs_in_folder'),
    path('play-song/<int:song_index>/', views.play_song, name='play_song'),
]
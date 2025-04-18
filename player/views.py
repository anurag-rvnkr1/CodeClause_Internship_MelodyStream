import os
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from .models import Song
from mutagen.mp3 import MP3
from mutagen.flac import FLAC
from mutagen.wave import WAVE
import mutagen


def index(request):
    return render(request, 'player/index.html')


def songs_in_folder(request):
    """Process the selected folder and return songs"""
    if request.method == 'POST' and request.POST.get('folder_path'):
        folder_path = request.POST.get('folder_path')
        
        # Clear existing songs from the session
        if 'playlist' in request.session:
            del request.session['playlist']
        
        # Check if folder exists
        if not os.path.exists(folder_path):
            return JsonResponse({'error': 'Folder not found'}, status=404)
        
        # Find all music files in the folder
        supported_extensions = ['.mp3', '.flac', '.wav']
        songs = []
        
        for file in os.listdir(folder_path):
            file_path = os.path.join(folder_path, file)
            if os.path.isfile(file_path) and os.path.splitext(file)[1].lower() in supported_extensions:
                song_info = {
                    'title': os.path.splitext(file)[0],
                    'file_path': file_path,
                    'duration': 0,
                    'artist': 'Unknown',
                    'album': 'Unknown'
                }
                
                # Try to extract metadata
                try:
                    ext = os.path.splitext(file)[1].lower()
                    if ext == '.mp3':
                        audio = MP3(file_path)
                        if audio.has_key('TIT2'):
                            song_info['title'] = str(audio['TIT2'])
                        if audio.has_key('TPE1'):
                            song_info['artist'] = str(audio['TPE1'])
                        if audio.has_key('TALB'):
                            song_info['album'] = str(audio['TALB'])
                        song_info['duration'] = int(audio.info.length)
                    elif ext == '.flac':
                        audio = FLAC(file_path)
                        if 'title' in audio:
                            song_info['title'] = audio['title'][0]
                        if 'artist' in audio:
                            song_info['artist'] = audio['artist'][0]
                        if 'album' in audio:
                            song_info['album'] = audio['album'][0]
                        song_info['duration'] = int(audio.info.length)
                    elif ext == '.wav':
                        audio = WAVE(file_path)
                        song_info['duration'] = int(audio.info.length)
                except:
                    # If metadata extraction fails, use filename as fallback
                    pass
                
                songs.append(song_info)
        
        # Store songs in session
        request.session['playlist'] = songs
        
        # Return songs list
        return JsonResponse({'songs': songs})
    
    return JsonResponse({'error': 'Invalid request'}, status=400)


def play_song(request, song_index):
    """Return song data for the requested index"""
    if 'playlist' in request.session and 0 <= song_index < len(request.session['playlist']):
        song = request.session['playlist'][song_index]
        
        # For security, we don't want to return the direct file path
        # Instead, we'll return a base64 encoded version of the file
        import base64
        
        try:
            with open(song['file_path'], 'rb') as f:
                song_data = base64.b64encode(f.read()).decode('utf-8')
                
            # Get the file extension
            ext = os.path.splitext(song['file_path'])[1].lower()
            
            # Map extension to mime type
            mime_types = {
                '.mp3': 'audio/mpeg',
                '.flac': 'audio/flac',
                '.wav': 'audio/wav'
            }
            
            mime_type = mime_types.get(ext, 'audio/mpeg')
            
            return JsonResponse({
                'title': song['title'],
                'artist': song['artist'],
                'duration': song['duration'],
                'data': f'data:{mime_type};base64,{song_data}'
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Song not found'}, status=404)
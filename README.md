# 🎵 Django Music Player 🎧
<div align="center">
  *A sleek, modern music player built with Django*
  
  [![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=flat-square&logo=python)](https://www.python.org/)
  [![Django](https://img.shields.io/badge/Django-4.2%2B-green?style=flat-square&logo=django)](https://www.djangoproject.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](http://makeapullrequest.com)
</div>

<div align="center">
  <img src="https://github.com/anurag-rvnkr1/CodeClause_Internship_MelodyStream/blob/main/screenshots/demo.gif" alt="Django Music Player" width="800"/>
  <p><i>MUSIC PLAYER</i></p>
</div>

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

<table>
  <tr>
    <td width="50%">
      <h3>🎧 Music Playback</h3>
      <ul>
        <li>Play/Pause/Stop controls</li>
        <li>Next/Previous track navigation</li>
        <li>Volume adjustment with mute toggle</li>
        <li>Seekable progress bar</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📁 File Management</h3>
      <ul>
        <li>Select any folder on your system</li>
        <li>Automatic loading of supported formats (MP3, FLAC, WAV)</li>
        <li>Persistent playlists between sessions</li>
        <li>Secure file handling</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎨 Visual Experience</h3>
      <ul>
        <li>Real-time audio visualization</li>
        <li>Responsive design for all devices</li>
        <li>Dark/Light theme toggle</li>
        <li>Sleek, modern UI</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📊 Music Info</h3>
      <ul>
        <li>Metadata extraction (title, artist, album)</li>
        <li>Track duration and current time display</li>
        <li>Album art display when available</li>
        <li>Responsive playlist with search functionality</li>
      </ul>
    </td>
  </tr>
</table>

## 💻 Technology Stack

- **Backend**: Django 4.2+
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Audio Processing**: Web Audio API
- **Data Storage**: SQLite (default), compatible with PostgreSQL
- **Visualization**: HTML5 Canvas
- **Styling**: CSS with custom animations
- **Icons**: Font Awesome 6

## 📥 Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/anurag-rvnkr1/CodeClause_Internship_MelodyStream.git
cd CodeClause_Internship_MelodyStream
```

### Step 2: Create a Virtual Environment

```bash
# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Database Setup

```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 5: Create a Superuser (Optional)

```bash
python manage.py createsuperuser
```

### Step 6: Run the Development Server

```bash
python manage.py runserver
```

Now open your browser and navigate to http://127.0.0.1:8000/

## 🎮 Usage

### 1. Adding Music

1. Click the "Select Folder" button
2. Navigate to any folder containing music files
3. Click "Open" to load all supported audio files from that location

### 2. Playback Controls

- **Play/Pause**: Toggle playback of the current track
- **Stop**: Completely stop the current track
- **Previous/Next**: Navigate through your playlist
- **Volume**: Adjust using the slider or click the speaker icon to mute
- **Seek**: Click anywhere on the progress bar to jump to that position

### 3. Playlist Management

- Tracks are automatically added to the playlist when you select a folder
- Click on any track in the playlist to start playing it
- Search functionality helps you find specific tracks
- Playlist state is preserved between sessions

### 4. Audio Visualization

The audio visualizer automatically responds to your music:
- Frequency-based visualization shows the audio spectrum in real-time
- Visualizer colors adapt to the current theme

## 📂 Project Structure

```
CodeClause_Internship_MelodyStream/
├── music_player/              # Django project settings
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py            # Project settings
│   ├── urls.py                # Project URLs
│   └── wsgi.py
├── player/                    # Music player app
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py              # Data models
│   ├── urls.py                # App URLs
│   ├── views.py               # View controllers
│   ├── forms.py               # Form definitions
│   ├── utils.py               # Utility functions
│   ├── templates/             # HTML templates
│   │   └── player/
│   │       ├── index.html     # Main player page
│   │       └── ...
│   └── static/                # Static assets
│       ├── css/               # Stylesheets
│       ├── js/                # JavaScript files
│       └── images/            # Images and icons
├── static/                    # Project-wide static files
├── media/                     # User-uploaded media
├── requirements.txt           # Project dependencies
├── manage.py                  # Django management script
└── README.md                  # This file
```



## 🔧 Advanced Configuration

### Custom Settings

You can customize various aspects of the player by editing the `settings.py` file:

```python
# Music player settings
MUSIC_PLAYER = {
    'SUPPORTED_FORMATS': ['mp3', 'flac', 'wav', 'ogg'],
    'MAX_UPLOAD_SIZE': 50 * 1024 * 1024,  # 50MB
    'ENABLE_VISUALIZER': True,
    'DEFAULT_THEME': 'dark',
    'CACHE_TIMEOUT': 3600  # 1 hour
}
```

### Database Configuration

The project is configured to use SQLite by default, but you can switch to PostgreSQL or other databases by updating the `DATABASES` configuration in `settings.py`.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

### Development Setup

For development, you may want to install additional packages:

```bash
pip install -r requirements-dev.txt
```

Run tests to ensure everything is working correctly:

```bash
python manage.py test
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Django](https://www.djangoproject.com/) - The web framework used
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - For audio processing and visualization
- [Font Awesome](https://fontawesome.com/) - For the beautiful icons
- [Bootstrap](https://getbootstrap.com/) - For responsive design components
- All the open-source contributors who make their work available for others to use and learn from

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/anurag-rvnkr1">Anurag Revankar</a></p>
  <p>
    <a href="https://github.com/anurag-rvnkr1">
      <img src="https://img.shields.io/github/followers/anurag-rvnkr1?label=Follow&style=social" alt="GitHub followers"/>
    </a>
  </p>
</div>

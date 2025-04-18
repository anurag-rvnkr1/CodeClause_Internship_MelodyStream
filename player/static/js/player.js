document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const folderForm = document.getElementById('folderForm');
    const folderPath = document.getElementById('folderPath');
    const playlist = document.getElementById('playlist');
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const stopBtn = document.getElementById('stopBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    const progressBar = document.querySelector('.progress-bar');
    const volumeControl = document.getElementById('volumeControl');
    const currentSongTitle = document.getElementById('currentSongTitle');
    const currentSongArtist = document.getElementById('currentSongArtist');
    const visualizer = document.getElementById('visualizer');
    const visualizerCtx = visualizer.getContext('2d');
    
    // Variables
    let songs = [];
    let currentSongIndex = -1;
    let audioContext = null;
    let analyser = null;
    let source = null;
    let animationFrame = null;
    
    // Set canvas size
    visualizer.width = visualizer.offsetWidth;
    visualizer.height = visualizer.offsetHeight;
    
    // Initialize volume
    audioPlayer.volume = volumeControl.value;
    
    // Event Listeners
    folderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        loadSongsFromFolder();
    });
    
    playBtn.addEventListener('click', togglePlay);
    stopBtn.addEventListener('click', stopAudio);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    volumeControl.addEventListener('input', changeVolume);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', playNext);
    audioPlayer.addEventListener('loadedmetadata', function() {
        totalTime.textContent = formatTime(audioPlayer.duration);
    });
    
    // Progress bar click event
    document.querySelector('.progress').addEventListener('click', function(e) {
        const progressWidth = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        
        audioPlayer.currentTime = (clickX / progressWidth) * duration;
    });
    
    // Functions
    function loadSongsFromFolder() {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        fetch('/songs-in-folder/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: new URLSearchParams({
                'folder_path': folderPath.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            
            songs = data.songs;
            updatePlaylist();
            
            // Enable controls
            playBtn.disabled = false;
            stopBtn.disabled = false;
            prevBtn.disabled = false;
            nextBtn.disabled = false;
            
            // Load first song
            if (songs.length > 0) {
                loadSong(0);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while loading songs.');
        });
    }
    
    function updatePlaylist() {
        // Clear playlist
        playlist.innerHTML = '';
        
        if (songs.length === 0) {
            const li = document.createElement('li');
            li.className = 'list-group-item placeholder-text';
            li.textContent = 'No songs loaded';
            playlist.appendChild(li);
            return;
        }
        
        // Add songs to playlist
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            if (index === currentSongIndex) {
                li.classList.add('active');
            }
            
            const title = document.createElement('div');
            title.className = 'song-title';
            title.textContent = song.title;
            
            const artist = document.createElement('div');
            artist.className = 'song-artist';
            artist.textContent = song.artist !== 'Unknown' ? song.artist : '';
            
            const duration = document.createElement('div');
            duration.className = 'song-duration';
            duration.textContent = formatTime(song.duration);
            
            li.appendChild(title);
            if (song.artist !== 'Unknown') {
                li.appendChild(artist);
            }
            li.appendChild(duration);
            
            li.addEventListener('click', () => loadSong(index));
            
            playlist.appendChild(li);
        });
    }
    
    function loadSong(index) {
        if (index < 0 || index >= songs.length) return;
        
        currentSongIndex = index;
        
        // Update UI
        updatePlaylist();
        currentSongTitle.textContent = songs[index].title;
        currentSongArtist.textContent = songs[index].artist !== 'Unknown' ? songs[index].artist : '';
        
        // Animate album art
        document.querySelector('.album-art').classList.add('animate');
        setTimeout(() => {
            document.querySelector('.album-art').classList.remove('animate');
        }, 500);
        
        // Load audio
        fetch(`/play-song/${index}/`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }
                
                audioPlayer.src = data.data;
                audioPlayer.load();
                
                // Auto play
                audioPlayer.play()
                    .then(() => {
                        updatePlayButton(false);
                        setupAudioVisualization();
                    })
                    .catch(err => {
                        console.error('Error playing audio:', err);
                        updatePlayButton(true);
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while loading the song.');
            });
    }
    
    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play()
                .then(() => {
                    updatePlayButton(false);
                    if (!audioContext) {
                        setupAudioVisualization();
                    }
                    else {
                        resumeVisualization();
                    }
                })
                .catch(err => {
                    console.error('Error playing audio:', err);
                });
        } else {
            audioPlayer.pause();
            updatePlayButton(true);
            pauseVisualization();
        }
    }
    
    function stopAudio() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        updatePlayButton(true);
        stopVisualization();
    }
    
    function playPrevious() {
        let newIndex = currentSongIndex - 1;
        if (newIndex < 0) {
            newIndex = songs.length - 1;
        }
        loadSong(newIndex);
    }
    
    function playNext() {
        let newIndex = currentSongIndex + 1;
        if (newIndex >= songs.length) {
            newIndex = 0;
        }
        loadSong(newIndex);
    }
    
    function updatePlayButton(isPaused) {
        if (isPaused) {
            playBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
            `;
        } else {
            playBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="currentColor"/>
                </svg>
            `;
        }
    }
    
    function changeVolume() {
        audioPlayer.volume = volumeControl.value;
    }
    
    function updateProgress() {
        const duration = audioPlayer.duration;
        const currentTimeValue = audioPlayer.currentTime;
        
        if (duration) {
            // Update progress bar
            const progressPercent = (currentTimeValue / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            // Update time display
            currentTime.textContent = formatTime(currentTimeValue);
        }
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Audio Visualization
    function setupAudioVisualization() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            
            source = audioContext.createMediaElementSource(audioPlayer);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
        }
        
        drawVisualization();
    }
    
    function drawVisualization() {
        if (!analyser) return;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        analyser.getByteFrequencyData(dataArray);
        
        // Clear canvas
        visualizerCtx.clearRect(0, 0, visualizer.width, visualizer.height);
        
        // Set bar width based on canvas size and buffer length
        const barWidth = (visualizer.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        // Draw bars
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            
            // Create gradient
            const gradient = visualizerCtx.createLinearGradient(0, 0, 0, visualizer.height);
            gradient.addColorStop(0, '#6c5ce7');
            gradient.addColorStop(0.5, '#fd79a8');
            gradient.addColorStop(1, '#00cec9');
            
            visualizerCtx.fillStyle = gradient;
            visualizerCtx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
        
        animationFrame = requestAnimationFrame(drawVisualization);
    }
    
    function pauseVisualization() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    }
    
    function resumeVisualization() {
        if (!animationFrame) {
            drawVisualization();
        }
    }
    
    function stopVisualization() {
        pauseVisualization();
        
        // Clear canvas
        if (visualizerCtx) {
            visualizerCtx.clearRect(0, 0, visualizer.width, visualizer.height);
        }
    }
    
    // Handle window resize for visualizer
    window.addEventListener('resize', function() {
        visualizer.width = visualizer.offsetWidth;
        visualizer.height = visualizer.offsetHeight;
    });
});    
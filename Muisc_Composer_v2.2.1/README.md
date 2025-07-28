# Music Composer - AI-Powered Melody Generation

Transform your humming into beautiful melodies using AI! This application consists of a Flask backend that processes audio and generates music, and a React frontend for user interaction.

## Features

- 🎤 **Audio Upload**: Upload WAV, MP3, or OGG audio files
- 🎵 **Start Sequence Extraction**: Extract musical notes from your humming
- 🎼 **AI Melody Generation**: Generate complete melodies using transformer models
- 🎹 **MIDI Export**: Convert generated melodies to MIDI files
- 🖥️ **User-friendly Interface**: Modern React frontend with drag-and-drop support

## Project Structure

```
Muisc_Composer/
├── backend/
│   ├── app.py                 # Flask API server
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Styles
│   ├── public/
│   │   └── index.html        # HTML template
│   └── package.json          # Node.js dependencies
├── Testings/                 # Python ML modules
│   ├── voice.py              # Audio processing
│   ├── production.py         # Melody generation
│   ├── jsontomidi.py         # MIDI conversion
│   └── requirements.txt      # ML dependencies
└── README.md
```

## Prerequisites

- Python 3.10+
- Node.js 16+
- npm or yarn

## Installation

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment (recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Also install dependencies for the ML modules
pip install -r ../Testings/requirements.txt
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install
```

## Running the Application

### 1. Start the Backend Server

```bash
# From the backend directory
cd backend
python app.py
```

The Flask server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
# From the frontend directory (in a new terminal)
cd frontend
npm start
```

The React app will start on `http://localhost:3000`

## Usage

1. **Upload Audio**: Drag and drop an audio file or click to browse
2. **Extract Sequence**: Click "Extract Sequence" to analyze your humming
3. **Generate Melody**: Click "Generate Melody" to create AI-generated music
4. **Convert to MIDI**: Click "Convert to MIDI" to create a downloadable file
5. **Download**: Click "Download MIDI" to save your generated melody

### Quick Workflow

For a complete end-to-end process, use the "Full Workflow" button which automatically:
- Extracts the start sequence from your audio
- Generates a melody using AI
- Converts it to MIDI format

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/upload-audio` - Upload audio and extract start sequence
- `POST /api/generate-melody` - Generate melody from start sequence
- `POST /api/convert-to-midi` - Convert melody to MIDI
- `GET /api/download-midi` - Download generated MIDI file
- `POST /api/process-full-workflow` - Complete workflow in one request

## Technical Details

### Backend Technologies
- **Flask**: Web framework
- **TensorFlow**: AI/ML processing
- **librosa**: Audio analysis
- **mido**: MIDI file creation
- **music21**: Music theory operations

### Frontend Technologies
- **React**: User interface
- **Axios**: HTTP client
- **CSS3**: Modern styling with gradients and animations

### Machine Learning Pipeline
1. **Audio Processing**: Extract pitches using librosa
2. **Note Detection**: Convert frequencies to MIDI notes
3. **Sequence Generation**: Use transformer model for melody generation
4. **MIDI Creation**: Convert token sequences to MIDI format

## Troubleshooting

### Common Issues

1. **Module not found errors**: Make sure all dependencies are installed in the correct virtual environment
2. **Audio upload fails**: Check file format (WAV, MP3, OGG supported)
3. **Melody generation timeout**: Large models may take time; increase timeout if needed
4. **CORS errors**: Ensure backend is running on port 5000

### Dependencies Issues

If you encounter missing dependencies:

```bash
# Install additional audio libraries
pip install pyaudio pydub

# For Windows users who have issues with audio libraries:
# You may need to install Visual C++ Build Tools or use conda instead of pip
```

## Development

### Adding New Features

1. **Backend**: Add new endpoints in `backend/app.py`
2. **Frontend**: Add new components in `frontend/src/`
3. **ML Models**: Modify processing in `Testings/` directory

### Environment Variables

Create a `.env` file in the frontend directory for custom API URLs:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- TensorFlow team for the ML framework
- librosa developers for audio processing capabilities
- React team for the frontend framework
- All open source contributors who made this possible

import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [startSequence, setStartSequence] = useState([]);
  const [generatedMelody, setGeneratedMelody] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [midiUrl, setMidiUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const steps = [
    'Upload Audio',
    'Extract Sequence',
    'Generate Melody',
    'Create MIDI'
  ];

  const resetState = () => {
    setFile(null);
    setStartSequence([]);
    setGeneratedMelody('');
    setCurrentStep(0);
    setStatus('');
    setAudioUrl('');
    setMidiUrl('');
    setIsPlaying(false);
  };

  const playAudio = (url) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && (selectedFile.type.includes('audio') || selectedFile.name.toLowerCase().includes('.wav'))) {
      setFile(selectedFile);
      setCurrentStep(1);
      setStatus({ type: 'info', message: `Selected: ${selectedFile.name}` });
      
      // Create audio URL for playback
      const url = URL.createObjectURL(selectedFile);
      setAudioUrl(url);
    } else {
      setStatus({ type: 'error', message: 'Please select a valid audio file (WAV, MP3, OGG)' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const processFullWorkflow = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select an audio file first' });
      return;
    }

    setLoading(true);
    setCurrentStep(1);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      setStatus({ type: 'info', message: 'Processing audio and extracting start sequence...' });
      setCurrentStep(2);

      const response = await axios.post(`${API_BASE_URL}/process-full-workflow`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout
      });

      if (response.data.start_sequence) {
        setStartSequence(response.data.start_sequence);
        setCurrentStep(3);
        setStatus({ type: 'info', message: 'Generating melody...' });
      }

      if (response.data.melody) {
        setGeneratedMelody(response.data.melody);
        setCurrentStep(4);
        setMidiUrl(`${API_BASE_URL}/play-midi`);
        setStatus({ type: 'success', message: 'Workflow completed successfully!' });
      }

    } catch (error) {
      console.error('Error:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'An error occurred during processing' 
      });
    } finally {
      setLoading(false);
    }
  };

  const extractStartSequence = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select an audio file first' });
      return;
    }

    setLoading(true);
    setCurrentStep(2);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      setStatus({ type: 'info', message: 'Extracting start sequence from audio...' });

      const response = await axios.post(`${API_BASE_URL}/upload-audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStartSequence(response.data.start_sequence);
      setStatus({ type: 'success', message: 'Start sequence extracted successfully!' });

    } catch (error) {
      console.error('Error:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to extract start sequence' 
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMelody = async () => {
    if (startSequence.length === 0) {
      setStatus({ type: 'error', message: 'Please extract start sequence first' });
      return;
    }

    setLoading(true);
    setCurrentStep(3);

    try {
      setStatus({ type: 'info', message: 'Generating melody... This may take a few minutes.' });

      const response = await axios.post(`${API_BASE_URL}/generate-melody`, {
        start_sequence: startSequence,
      }, {
        timeout: 300000, // 5 minutes timeout
      });

      setGeneratedMelody(response.data.melody);
      setStatus({ type: 'success', message: 'Melody generated successfully!' });

    } catch (error) {
      console.error('Error:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to generate melody' 
      });
    } finally {
      setLoading(false);
    }
  };

  const convertToMidi = async () => {
    if (!generatedMelody) {
      setStatus({ type: 'error', message: 'Please generate melody first' });
      return;
    }

    setLoading(true);
    setCurrentStep(4);

    try {
      setStatus({ type: 'info', message: 'Converting to MIDI...' });

      const response = await axios.post(`${API_BASE_URL}/convert-to-midi`, {
        melody: generatedMelody,
      });

      // Set MIDI URL for playback
      setMidiUrl(`${API_BASE_URL}/play-midi`);
      setStatus({ type: 'success', message: 'MIDI file created successfully!' });

    } catch (error) {
      console.error('Error:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to convert to MIDI' 
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadMidi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/download-midi`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'generated_melody.mid');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading MIDI:', error);
      setStatus({ 
        type: 'error', 
        message: 'Failed to download MIDI file' 
      });
    }
  };

  const recordAudio = async () => {
    setRecording(true);
    setLoading(true);
    setCurrentStep(2);

    try {
      setStatus({ type: 'info', message: 'Recording audio... Please hum into your microphone for 5 seconds.' });

      const response = await axios.post(`${API_BASE_URL}/record-audio`, {}, {
        timeout: 60000, // 1 minute timeout
      });

      setStartSequence(response.data.start_sequence);
      setAudioUrl(`${API_BASE_URL}/get-recorded-audio`);
      setStatus({ type: 'success', message: 'Audio recorded and processed successfully!' });

    } catch (error) {
      console.error('Error recording audio:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to record audio' 
      });
    } finally {
      setRecording(false);
      setLoading(false);
    }
  };

  const createDemo = async () => {
    setLoading(true);
    setCurrentStep(4);

    try {
      setStatus({ type: 'info', message: 'Creating demo melody...' });

      const response = await axios.post(`${API_BASE_URL}/create-demo`);

      setStartSequence(response.data.start_sequence);
      setGeneratedMelody(response.data.melody);
      setMidiUrl(`${API_BASE_URL}/play-midi`);
      setStatus({ type: 'success', message: 'Demo created successfully! You can now play and download the sample melody.' });

    } catch (error) {
      console.error('Error creating demo:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to create demo' 
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎵 Music Generator</h1>
        <p>Transform your humming into beautiful melodies using AI</p>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        {steps.map((step, index) => (
          <div key={index} className={`step ${index < currentStep ? 'completed' : ''} ${index === currentStep ? 'active' : ''}`}>
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>

      <div className="main-content">
        {/* Upload Section */}
        <div className="card">
          <h2>📤 Upload Audio</h2>
          
          <div 
            className={`upload-area ${dragOver ? 'dragover' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-text">
              {file ? '✅ File Selected' : recording ? '🎤 Recording...' : '🎤 Drop your audio file here or record directly'}
            </div>
            <div className="upload-hint">
              Click to browse (WAV, MP3, OGG) or use "Record & Process" button below
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.wav,.mp3,.ogg"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          {file && (
            <div className="file-info">
              <div className="file-name">📄 {file.name}</div>
              <div className="file-size">📊 {formatFileSize(file.size)}</div>
              {audioUrl && (
                <div className="audio-controls">
                  <button 
                    onClick={() => playAudio(audioUrl)}
                    disabled={isPlaying}
                    className="btn btn-secondary"
                    style={{ marginTop: '10px', marginRight: '10px' }}
                  >
                    ▶️ Play Audio
                  </button>
                  <button 
                    onClick={stopAudio}
                    disabled={!isPlaying}
                    className="btn btn-secondary"
                    style={{ marginTop: '10px' }}
                  >
                    ⏹️ Stop
                  </button>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={processFullWorkflow} 
              disabled={!file || loading}
              className="btn"
            >
              🚀 Full Workflow
            </button>
            <button 
              onClick={extractStartSequence} 
              disabled={!file || loading}
              className="btn btn-secondary"
            >
              🎵 Extract Sequence
            </button>
            <button 
              onClick={recordAudio} 
              disabled={loading || recording}
              className="btn btn-success"
            >
              🎤 Record & Process
            </button>
            <button 
              onClick={resetState}
              className="btn btn-secondary"
              disabled={loading}
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Controls Section */}
        <div className="card">
          <h2>🎛️ Controls</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button 
              onClick={generateMelody} 
              disabled={startSequence.length === 0 || loading}
              className="btn"
            >
              🎼 Generate Melody
            </button>
            
            <button 
              onClick={convertToMidi} 
              disabled={!generatedMelody || loading}
              className="btn btn-secondary"
            >
              🎹 Convert to MIDI
            </button>
            
            <button 
              onClick={downloadMidi} 
              disabled={currentStep < 4}
              className="btn btn-success"
            >
              💾 Download MIDI
            </button>

            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '15px', marginTop: '10px' }}>
              <button 
                onClick={createDemo} 
                disabled={loading}
                className="btn"
                style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' }}
              >
                🎭 Try Demo
              </button>
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px', textAlign: 'center' }}>
                Create a sample melody to test the player
              </p>
            </div>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <div>Processing...</div>
            </div>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {status && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}

      {/* Results Section */}
      <div className="results-section">
        <h2>📊 Results & Demo</h2>
        
        {/* Audio Demo Section */}
        {(audioUrl || midiUrl) && (
          <div className="demo-section">
            <h3>🎧 Audio Demo</h3>
            <div className="demo-controls">
              {audioUrl && (
                <div className="demo-item">
                  <span className="demo-label">🎤 Original Audio:</span>
                  <div className="demo-buttons">
                    <button 
                      onClick={() => playAudio(audioUrl)}
                      disabled={isPlaying}
                      className="btn btn-secondary"
                    >
                      ▶️ Play
                    </button>
                    <button 
                      onClick={stopAudio}
                      disabled={!isPlaying}
                      className="btn btn-secondary"
                    >
                      ⏹️ Stop
                    </button>
                  </div>
                </div>
              )}
              
              {midiUrl && (
                <div className="demo-item">
                  <span className="demo-label">🎹 Generated MIDI:</span>
                  <div className="demo-buttons">
                    <button 
                      onClick={() => playAudio(midiUrl)}
                      disabled={isPlaying}
                      className="btn btn-success"
                    >
                      ▶️ Play MIDI
                    </button>
                    <button 
                      onClick={stopAudio}
                      disabled={!isPlaying}
                      className="btn btn-secondary"
                    >
                      ⏹️ Stop
                    </button>
                    <button 
                      onClick={downloadMidi} 
                      className="btn"
                    >
                      💾 Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {startSequence.length > 0 && (
          <div>
            <h3>🎵 Start Sequence</h3>
            <div className="sequence-display">
              {startSequence.map((note, index) => (
                <span key={index} className="sequence-item">{note}</span>
              ))}
            </div>
          </div>
        )}

        {generatedMelody && (
          <div>
            <h3>🎼 Generated Melody</h3>
            <div className="melody-display">
              {generatedMelody}
            </div>
          </div>
        )}

        {currentStep >= 4 && (
          <div className="status success">
            ✅ MIDI file is ready for download and playback!
          </div>
        )}
      </div>

      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default App;

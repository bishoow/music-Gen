from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys
import json
import tempfile
from werkzeug.utils import secure_filename
import subprocess

# Add the Testings directory to Python path to import modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'Testings'))

try:
    from voice import get_start_sequence
    from jsontomidi import json_to_midi
except ImportError as e:
    print(f"Import error: {e}")
    print("Make sure all required packages are installed")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
GENERATED_FOLDER = 'generated'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Music Composer API is running"})

@app.route('/api/record-audio', methods=['POST'])
def record_and_process():
    """Record audio using voice.py and process it"""
    try:
        # Change to Testings directory for processing
        original_cwd = os.getcwd()
        testings_dir = os.path.join(os.path.dirname(__file__), '..', 'Testings')
        os.chdir(testings_dir)
        
        try:
            # Use venv10 Python to run voice.py
            python_exe = r"C:\Users\Asus\Desktop\s6\s7\music gen\Muisc_Composer_v2.2.1\venv10\Scripts\python.exe"
            result = subprocess.run([
                python_exe, 'voice.py'
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode != 0:
                os.chdir(original_cwd)
                return jsonify({
                    "error": "Audio recording failed",
                    "details": result.stderr
                }), 500
            
            # Read the generated start sequence
            try:
                with open('start_sequence.json', 'r') as f:
                    start_sequence = json.load(f)
            except FileNotFoundError:
                os.chdir(original_cwd)
                return jsonify({"error": "No start sequence generated"}), 400
            
            os.chdir(original_cwd)
            
            return jsonify({
                "message": "Audio recorded and processed successfully",
                "start_sequence": start_sequence,
                "output": result.stdout
            })
        
        except subprocess.TimeoutExpired:
            os.chdir(original_cwd)
            return jsonify({"error": "Audio recording timed out"}), 500
        except Exception as e:
            os.chdir(original_cwd)
            return jsonify({"error": f"Error recording audio: {str(e)}"}), 500
    
    except Exception as e:
        return jsonify({"error": f"Recording failed: {str(e)}"}), 500

@app.route('/api/upload-audio', methods=['POST'])
def upload_audio():
    """Upload audio file and extract start sequence"""
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        file = request.files['audio']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename or "audio_file")
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Process the audio file to get start sequence
            # Change to Testings directory for processing
            original_cwd = os.getcwd()
            testings_dir = os.path.join(os.path.dirname(__file__), '..', 'Testings')
            os.chdir(testings_dir)
            
            try:
                # Copy uploaded file to Testings directory
                import shutil
                shutil.copy(file_path, 'humming.wav')
                
                # Extract start sequence
                start_sequence = get_start_sequence('humming.wav')
                
                # Save start sequence
                with open('start_sequence.json', 'w') as f:
                    json.dump(start_sequence, f)
                
                os.chdir(original_cwd)
                
                return jsonify({
                    "message": "Audio processed successfully",
                    "start_sequence": start_sequence,
                    "filename": filename
                })
            
            except Exception as e:
                os.chdir(original_cwd)
                return jsonify({"error": f"Error processing audio: {str(e)}"}), 500
        
        return jsonify({"error": "Invalid file type"}), 400
    
    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500

@app.route('/api/generate-melody', methods=['POST'])
def generate_melody():
    """Generate melody using the production.py script"""
    try:
        data = request.get_json()
        start_sequence = data.get('start_sequence', [])
        
        if not start_sequence:
            return jsonify({"error": "No start sequence provided"}), 400
        
        # Change to Testings directory
        original_cwd = os.getcwd()
        testings_dir = os.path.join(os.path.dirname(__file__), '..', 'Testings')
        os.chdir(testings_dir)
        
        try:
            # Save start sequence
            with open('start_sequence.json', 'w') as f:
                json.dump(start_sequence, f)
            
            # Run production.py with venv10 Python
            python_exe = r"C:\Users\Asus\Desktop\s6\s7\music gen\Muisc_Composer_v2.2.1\venv10\Scripts\python.exe"
            result = subprocess.run([
                python_exe, 'production.py'
            ], capture_output=True, text=True, timeout=300)
            
            if result.returncode != 0:
                os.chdir(original_cwd)
                return jsonify({
                    "error": "Melody generation failed",
                    "details": result.stderr
                }), 500
            
            # Read generated melody
            with open('generated_melody.json', 'r') as f:
                generated_melody = json.load(f)
            
            os.chdir(original_cwd)
            
            return jsonify({
                "message": "Melody generated successfully",
                "melody": generated_melody,
                "output": result.stdout
            })
        
        except subprocess.TimeoutExpired:
            os.chdir(original_cwd)
            return jsonify({"error": "Melody generation timed out"}), 500
        except Exception as e:
            os.chdir(original_cwd)
            return jsonify({"error": f"Error generating melody: {str(e)}"}), 500
    
    except Exception as e:
        return jsonify({"error": f"Generation failed: {str(e)}"}), 500

@app.route('/api/convert-to-midi', methods=['POST'])
def convert_to_midi():
    """Convert generated melody to MIDI file"""
    try:
        data = request.get_json()
        melody = data.get('melody', '')
        
        if not melody:
            return jsonify({"error": "No melody provided"}), 400
        
        # Change to Testings directory
        original_cwd = os.getcwd()
        testings_dir = os.path.join(os.path.dirname(__file__), '..', 'Testings')
        os.chdir(testings_dir)
        
        try:
            # Save melody to file
            with open('generated_melody.json', 'w') as f:
                json.dump(melody, f)
            
            # Convert to MIDI
            json_to_midi('generated_melody.json', 'output.mid')
            
            # Copy MIDI file to generated folder
            import shutil
            midi_path = os.path.join(original_cwd, GENERATED_FOLDER, 'output.mid')
            shutil.copy('output.mid', midi_path)
            
            os.chdir(original_cwd)
            
            return jsonify({
                "message": "MIDI file generated successfully",
                "midi_path": "output.mid"
            })
        
        except Exception as e:
            os.chdir(original_cwd)
            return jsonify({"error": f"Error converting to MIDI: {str(e)}"}), 500
    
    except Exception as e:
        return jsonify({"error": f"Conversion failed: {str(e)}"}), 500

@app.route('/api/download-midi', methods=['GET'])
def download_midi():
    """Download the generated MIDI file"""
    try:
        midi_path = os.path.join(GENERATED_FOLDER, 'output.mid')
        if os.path.exists(midi_path):
            return send_file(midi_path, as_attachment=True, download_name='generated_melody.mid')
        else:
            return jsonify({"error": "MIDI file not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Download failed: {str(e)}"}), 500

@app.route('/api/process-full-workflow', methods=['POST'])
def process_full_workflow():
    """Complete workflow: audio -> start sequence -> melody -> MIDI"""
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        file = request.files['audio']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not (file and allowed_file(file.filename)):
            return jsonify({"error": "Invalid file type"}), 400
        
        filename = secure_filename(file.filename or "audio_file")
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Change to Testings directory for processing
        original_cwd = os.getcwd()
        testings_dir = os.path.join(os.path.dirname(__file__), '..', 'Testings')
        os.chdir(testings_dir)
        
        try:
            # Step 1: Extract start sequence from audio
            import shutil
            shutil.copy(file_path, 'humming.wav')
            start_sequence = get_start_sequence('humming.wav')
            
            if not start_sequence:
                os.chdir(original_cwd)
                return jsonify({"error": "Could not extract start sequence from audio"}), 400
            
            # Step 2: Generate melody with venv10 Python
            python_exe = r"C:\Users\Asus\Desktop\s6\s7\music gen\Muisc_Composer_v2.2.1\venv10\Scripts\python.exe"
            result = subprocess.run([
                python_exe, 'production.py'
            ], capture_output=True, text=True, timeout=300)
            
            if result.returncode != 0:
                os.chdir(original_cwd)
                return jsonify({
                    "error": "Melody generation failed",
                    "details": result.stderr
                }), 500
            
            # Step 3: Read generated melody
            with open('generated_melody.json', 'r') as f:
                generated_melody = json.load(f)
            
            # Step 4: Convert to MIDI
            json_to_midi('generated_melody.json', 'output.mid')
            
            # Copy MIDI file to generated folder
            midi_path = os.path.join(original_cwd, GENERATED_FOLDER, 'output.mid')
            shutil.copy('output.mid', midi_path)
            
            os.chdir(original_cwd)
            
            return jsonify({
                "message": "Full workflow completed successfully",
                "start_sequence": start_sequence,
                "melody": generated_melody,
                "midi_available": True,
                "output": result.stdout
            })
        
        except subprocess.TimeoutExpired:
            os.chdir(original_cwd)
            return jsonify({"error": "Melody generation timed out"}), 500
        except Exception as e:
            os.chdir(original_cwd)
            return jsonify({"error": f"Workflow failed: {str(e)}"}), 500
    
    except Exception as e:
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500

if __name__ == '__main__':
    print("Starting Music Composer API...")
    print("Make sure you have installed all required packages:")
    print("pip install flask flask-cors")
    app.run(debug=True, host='0.0.0.0', port=5000)

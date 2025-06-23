from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this!

jwt = JWTManager(app)

client = MongoClient("mongodb+srv://shresthabishow11:bishow11@cluster0.d7dl5yx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['musicgen']
users = db['users']

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'message': 'Please fill in all fields'}), 400

    if users.find_one({'email': email}):
        return jsonify({'message': 'Email already registered'}), 400

    hashed_password = generate_password_hash(password)
    users.insert_one({'name': name, 'email': email, 'password': hashed_password})

    access_token = create_access_token(identity=email)
    return jsonify({'message': 'User registered successfully', 'access_token': access_token}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=email)
    return jsonify({'message': 'Login successful', 'access_token': access_token}), 200

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def profile():
    email = get_jwt_identity()
    user = users.find_one({'email': email}, {'_id': 0, 'password': 0})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
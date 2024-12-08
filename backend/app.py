from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime, timezone
import traceback
from utils import calculate_metrics
import os

app = Flask(__name__, static_folder='../frontend')
CORS(app)

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    print('Dati ricevuti:', data)

    try:
        birth_date = data.get('birthDate')
        gender = data.get('gender')

        if not birth_date or not gender:
            return jsonify({'error': 'Birth date and gender are required'}), 400

        birth_date = birth_date.replace('Z', '+00:00')
        birth_date = datetime.fromisoformat(birth_date).replace(tzinfo=timezone.utc)

        now = datetime.now(timezone.utc)
        delta = now - birth_date

        metrics = calculate_metrics(birth_date, gender)
        return jsonify(metrics)
    except Exception as e:
        print(f"Errore: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=8000, debug=True)

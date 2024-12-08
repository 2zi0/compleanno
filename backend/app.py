from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
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
    try:
        print("Ricevuta richiesta POST")
        print(f"Headers: {request.headers}")
        print(f"Data: {request.get_data()}")
        
        birth_date = request.json.get('birthDate')
        gender = request.json.get('gender')
        
        print(f"Data di nascita ricevuta: {birth_date}")
        print(f"Genere ricevuto: {gender}")
        
        if not birth_date or not gender:
            return jsonify({'error': 'Birth date and gender are required'}), 400
        
        try:
            # Rimuovi la Z e aggiungi il fuso orario
            birth_date = birth_date.replace('Z', '+00:00')
            birth_date = datetime.fromisoformat(birth_date)
        except ValueError as e:
            print(f"Errore nel parsing della data: {birth_date}")
            print(f"Errore dettagliato: {traceback.format_exc()}")
            return jsonify({'error': 'Formato data non valido. Usa il formato YYYY-MM-DDTHH:mm'}), 400
        
        print(f"Data di nascita convertita: {birth_date}")
        
        metrics = calculate_metrics(birth_date, gender)
        print(f"Metriche calcolate: {metrics}")
        
        return jsonify(metrics)
    except Exception as e:
        print(f"Errore: {str(e)}")
        print(f"Tipo di errore: {type(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        print(f"Request data: {request.json}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=8000, debug=True)

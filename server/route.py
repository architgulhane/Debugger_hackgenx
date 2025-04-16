# app/routes.py
from flask import jsonify
from app import app
from app.db import db 

@app.route('/get-all-data', methods=['GET'])
def get_all_data():
    try:
        data = db.get().val()  # Fetch everything
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

from flask import Flask, jsonify
import pyrebase

# Firebase config
config = {
    "apiKey": "AIzaSyBEfNdR0xmbQLs2nmjWgz56GXzcSFUq8pk",
    "authDomain": "hackgenx-4e89b.firebaseapp.com",
    "projectId": "hackgenx-4e89b",
    "storageBucket": "hackgenx-4e89b.firebasestorage.app",
    "messagingSenderId": "559110230845",
    "appId": "1:559110230845:web:f5cba366f0d1387fe92b54",
    "measurementId": "G-GTFWC6TCDV",
    "databaseURL": "https://hackgenx-4e89b-default-rtdb.firebaseio.com"
}

# Initialize Firebase
firebase = pyrebase.initialize_app(config)
db = firebase.database()

# Initialize Flask
app = Flask(__name__)

# Route to check connection
@app.route("/")
def home():
    return jsonify({"message": "Firebase Flask API running"}), 200

# Route to get all data
@app.route("/get-all-data", methods=["GET"])
def get_all_data():
    try:
        data = db.get().val() 
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

# 🚀 Server – Backend API & ML Model Integration

This folder contains the backend logic for the **Smart Budget Allocation System**, including API endpoints, data generation, database integration, and machine learning model handling.

---

## 📁 Directory Structure

### 🧠 `AutogluonModels/ag-20250416_075717/`
This directory stores AutoGluon model checkpoints or training outputs.  
**Note:** This should be added to `.gitignore` to prevent large files from being pushed to version control.

---

## 📄 Main Files

### 🔧 `app.py`
- The primary Flask application entry point.
- Sets up core routes and integrates Firebase.
- Handles initial GET/POST requests.

### 🔧 `appp.py`
- Possibly a temporary or alternate version of `app.py`.
- Used for testing a third model (`model 3 tested`).
- **Suggestion:** Consider merging or removing duplicates if not needed.

### 📈 `datagen.py`
- Generates synthetic or sample budget data.
- Useful for training or testing the ML models when real data is unavailable.

### 🔗 `db.py`
- Firebase database configuration and integration.
- Includes functions for interacting with Firestore/Realtime DB.

### 🔄 `route.py`
- Manages specific API endpoints.
- Modular approach to separate routing logic from the main app.

### ▶️ `run.py`
- Starts the Flask server.
- Commonly used during development to boot up the backend quickly.

🔧 How to Run
bash
Copy
Edit
# Step 1: Install dependencies
pip install -r requirement.txt

# Step 2: Start the server
python run.py
The server should now be running locally on http://localhost:5000.

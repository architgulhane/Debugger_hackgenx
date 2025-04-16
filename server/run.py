from flask import Flask, request, jsonify
from autogluon.tabular import TabularPredictor
import pandas as pd
import os

app = Flask(__name__)


MODEL_DIR = "model.pkl"  
predictor = TabularPredictor.load(MODEL_DIR)

@app.route("/")
def home():
    return "Ministry Budget Allocation Predictor is running."

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not isinstance(data, list):
            data = [data]

        df = pd.DataFrame(data)
        predictions = predictor.predict(df)

        results = []
        for i, record in enumerate(data):
            prediction = predictions.iloc[i]
            record["Predicted_Allocated_Budget"] = float(prediction)  
            results.append(record)

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)

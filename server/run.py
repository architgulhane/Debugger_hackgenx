
import os
import pandas as pd
import pickle
from flask import Flask, request, jsonify
from autogluon.tabular import TabularPredictor

app = Flask(__name__)


MODEL_DIR = "models"
ENCODERS_PATH = os.path.join(MODEL_DIR, "label_encoders.pkl")


if not os.path.exists(MODEL_DIR):
    raise FileNotFoundError(f"Model directory not found at {MODEL_DIR}. Make sure you've trained and saved the model.")

if not os.path.exists(ENCODERS_PATH):
    raise FileNotFoundError(f"Encoders not found at {ENCODERS_PATH}. Make sure to save them after training.")

predictor = TabularPredictor.load(MODEL_DIR)

with open(ENCODERS_PATH, "rb") as f:
    encoders = pickle.load(f)


def encode_input(data):
    encoded = data.copy()
    for col, encoder in encoders.items():
        if col in encoded:
            try:
                encoded[col] = encoder.transform([encoded[col]])[0]
            except ValueError:
                encoded[col] = -1  # Unknown category fallback
    return encoded


def generate_reasoning(input_data, predicted_budget, expected_budget):
    reasons = []
    diff = predicted_budget - expected_budget
    percent_diff = (diff / expected_budget) * 100 if expected_budget else 0

    try:
        if input_data['Priority_Level'] == encoders['Priority_Level'].transform(['high'])[0] and diff < 0:
            reasons.append("Despite being high priority, budget allocation is lower than expected.")
    except:
        pass

    if input_data.get('Dev_Index', 1) < 0.4 and diff < 0:
        reasons.append("Low development index could have impacted reduced allocation.")
    if input_data.get('GDP_Impact (%)', 2) < 1 and diff < 0:
        reasons.append("Low GDP impact of the ministry might have reduced the allocation.")
    if input_data.get('Projects_Count', 0) > 10 and diff < 0:
        reasons.append("Although there are many projects, the budget allocation is lower.")
    if abs(percent_diff) > 30:
        reasons.append("Large deviation observed in allocated vs expected budget.")
    if not reasons:
        reasons.append("Allocation seems in line with expectations or is driven by overall national priorities.")

    return reasons


@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_json = request.json
        expected_budget = input_json.pop("Expected_Budget", None)

        encoded_data = encode_input(input_json)
        df = pd.DataFrame([encoded_data])

        prediction = predictor.predict(df)[0]

        response = {
            "predicted_budget": round(float(prediction), 2)
        }

        if expected_budget is not None:
            reasons = generate_reasoning(encoded_data, prediction, expected_budget)
            response["expected_budget"] = expected_budget
            response["reasoning"] = reasons

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
=======
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

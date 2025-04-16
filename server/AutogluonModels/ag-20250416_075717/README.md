# 🧠 AutoGluon Model – ag-20250416_075717

This directory contains the full saved state of a trained **AutoGluon machine learning model** used for budget prediction or related tasks in the Smart Budget Allocation System. It includes all necessary files for inference and further training.

---

## 📁 Folder Contents

### 📂 `models/`
- Stores internal model files (e.g., individual model checkpoints, weights, etc.).
- Automatically managed by AutoGluon.
- Do not modify unless you know what you're doing.

### 📂 `utils/`
- Utility functions or helper files used during model training or prediction.
- May include feature transformation logic, pre/post-processing scripts, etc.

---

## 📄 Key Files

### 🧠 `predictor.pkl`
- The main AutoGluon `TabularPredictor` object.
- Use this to make predictions on new data.
- Can be loaded via:
```python
from autogluon.tabular import TabularPredictor
predictor = TabularPredictor.load("AutogluonModels/ag-20250416_075717")

📦 learner.pkl
Stores learner-specific information used during training.

AutoGluon uses this internally; not typically needed for predictions.

📄 metadata.json
Contains metadata about the training process:

Dataset used

Problem type (e.g., regression or classification)

Features and labels

Training time and environment

📄 version.txt
AutoGluon version used to train the model.

Important for compatibility when reloading or deploying the model.

🚀 How to Use This Model
python
Copy
Edit
from autogluon.tabular import TabularPredictor

# Load the trained model
predictor = TabularPredictor.load("AutogluonModels/ag-20250416_075717")

# Predict on new data
predictions = predictor.predict(new_data_df)

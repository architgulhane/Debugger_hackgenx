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

# 🧠 AutoGluon Trained Models

This directory contains various trained machine learning models used for the **Smart Budget Allocation System** or related tasks. These models are part of the AutoGluon ensemble, which combines the predictions of multiple models to achieve superior performance.

Each model file represents a specific machine learning algorithm, and the models are all part of an ensemble learning system designed to make accurate budget predictions.

---

## 📂 Folder Contents

### 🔹 **`CatBoost`**
- A decision tree-based algorithm that uses boosting to improve predictive accuracy.
- Known for being efficient and producing high-quality predictions on tabular data.

### 🔹 **`ExtraTreesMSE`**
- An ensemble of extremely random trees that minimizes Mean Squared Error (MSE).
- Performs well on regression tasks.

### 🔹 **`KNeighborsDist`**
- A variant of the K-Nearest Neighbors (KNN) algorithm using distance-based weighting.
- Ideal for tasks requiring local feature similarities.

### 🔹 **`KNeighborsUnif`**
- A KNN model using uniform weights.
- Good for tasks where all neighbors should have equal importance.

### 🔹 **`LightGBM`**
- A gradient boosting framework that is efficient and scalable.
- Known for handling large datasets quickly and providing accurate predictions.

### 🔹 **`LightGBMLarge`**
- A version of LightGBM that is optimized for handling large datasets.
- Utilizes more memory and computational resources for increased accuracy.

### 🔹 **`LightGBMXT`**
- Another variant of LightGBM, specifically using the "XGBoost tree" model for more robust performance on tabular data.

### 🔹 **`NeuralNetFastAI`**
- A neural network trained using the FastAI library.
- Performs well with deep learning tasks on structured data.

### 🔹 **`NeuralNetTorch`**
- A neural network trained using PyTorch, a popular deep learning framework.
- Used for more complex prediction tasks, requiring higher computing power.

### 🔹 **`RandomForestMSE`**
- A Random Forest model that minimizes Mean Squared Error (MSE).
- One of the most robust models for regression tasks with tabular data.

### 🔹 **`WeightedEnsemble_L2`**
- A model that combines predictions from the previous models using a weighted ensemble technique.
- This model generally provides the best predictions by leveraging the strengths of multiple algorithms.

### 🔹 **`XGBoost`**
- A highly effective gradient boosting algorithm that is often the top performer in structured data tasks.
- Known for its speed and high accuracy.

---

### 📂 **Other Files**

#### **`.DS_Store`**
- A system file used by macOS for folder attributes. This file can be ignored or deleted, as it is not essential for the model's functionality.

#### **`trainer.pkl`**
- A pickle file that contains the information related to the training process and possibly some metadata about the training procedure.
- This file can be used to reload or replicate the training process.

---

## 🚀 How to Use These Models

Each model can be loaded and used independently or as part of the ensemble for predictions. Here’s how to load and use a model with **AutoGluon**:

```python
from autogluon.tabular import TabularPredictor

# Example: Load and make predictions with a specific model
predictor = TabularPredictor.load("path_to_model/LightGBM")

# Predict on new data
predictions = predictor.predict(new_data_df)

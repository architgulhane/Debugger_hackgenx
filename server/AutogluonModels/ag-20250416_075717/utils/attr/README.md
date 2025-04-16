# 🛠️ Model Attribute Files for Training and Prediction

This directory contains the pre-trained model attribute files for various machine learning models. These attribute files are essential for performing predictions and evaluations using AutoGluon and other machine learning frameworks.

## 📂 Folder Structure

### **`attr/`**: Pre-Trained Model Attribute Files
This folder contains pre-trained model attribute files for various algorithms. Each model corresponds to an optimized version of a specific machine learning algorithm. These files are saved in serialized format (pickle `.pkl` files) and are essential for model inference and prediction tasks.

Below are the files present in this folder:

- **`CatBoost`**
  - A gradient boosting algorithm that works well with categorical features. It is optimized for large datasets and high-dimensional problems.
  
- **`ExtraTreesMSE`**
  - An ensemble method based on extremely randomized trees (ExtraTrees). It is designed to minimize the Mean Squared Error (MSE) for regression tasks.
  
- **`KNeighborsDist`**
  - A K-Nearest Neighbors (KNN) model that uses distance-based weighting for neighbors, improving performance on regression tasks.
  
- **`KNeighborsUnif`**
  - A variant of K-Nearest Neighbors (KNN) where all neighbors are treated equally (uniform weights).
  
- **`LightGBM`**
  - A gradient boosting model known for high performance, especially on large datasets. It is optimized for both speed and accuracy.
  
- **`LightGBMLarge`**
  - An enhanced version of LightGBM designed specifically to handle very large datasets with improved computational efficiency.
  
- **`LightGBMXT`**
  - A variant of LightGBM that uses an optimized tree structure, making it ideal for large datasets and reducing overfitting.
  
- **`NeuralNetFastAI`**
  - A deep learning model built using the FastAI library, designed for structured data tasks. It leverages neural networks for complex pattern recognition.
  
- **`NeuralNetTorch`**
  - A neural network model built using PyTorch, offering flexibility for complex deep learning tasks.
  
- **`RandomForestMSE`**
  - A Random Forest model designed for regression tasks, specifically trained to minimize Mean Squared Error (MSE).
  
- **`XGBoost`**
  - A highly efficient and widely used gradient boosting algorithm. It is known for its accuracy and speed in large-scale machine learning tasks.

---

## 🚀 How to Use the Model Attribute Files

These model files are serialized as pickle files (`.pkl`). To use them in your code for making predictions, simply load the respective model file and pass the input data to it.

Here is an example of how to load and use these models for prediction:

```python
import pickle

# Load a pre-trained model (e.g., LightGBM)
with open('attr/LightGBM', 'rb') as f:
    model = pickle.load(f)

# Example data to predict
X_new = ...  # Your new input data here

# Make predictions using the model
predictions = model.predict(X_new)

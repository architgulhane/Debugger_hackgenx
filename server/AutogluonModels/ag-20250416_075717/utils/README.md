# 🛠️ Utility Files for Model Processing

This directory contains utility files and data associated with the models. It includes various preprocessed attributes used for training, along with datasets that are used for model predictions and validation.

## 📂 Folder Structure

### **`attr/`**: Model Attribute Files
This folder contains preprocessed model attribute files corresponding to various machine learning models. These attributes are used during model training and fine-tuning for each respective algorithm. Each file in this folder is a serialized version of a model, trained with AutoGluon.

The following model files are stored in this directory:

- **`CatBoost`**
  - A decision tree-based gradient boosting model optimized for large datasets and categorical features.
  
- **`ExtraTreesMSE`**
  - An ensemble model using extremely random trees (ExtraTrees) to minimize Mean Squared Error (MSE).
  
- **`KNeighborsDist`**
  - K-Nearest Neighbors algorithm that uses distance-based weighting for neighbors.
  
- **`KNeighborsUnif`**
  - K-Nearest Neighbors with uniform weights for all neighbors.
  
- **`LightGBM`**
  - A gradient boosting framework optimized for large datasets and efficient computation.

- **`LightGBMLarge`**
  - An enhanced version of LightGBM tailored for very large datasets.

- **`LightGBMXT`**
  - LightGBM variant using an optimized tree structure for greater model performance.

- **`NeuralNetFastAI`**
  - A neural network model using the FastAI library for deep learning on structured data.
  
- **`NeuralNetTorch`**
  - A PyTorch-based neural network model for more complex prediction tasks.
  
- **`RandomForestMSE`**
  - Random Forest model for regression tasks, specifically designed to minimize Mean Squared Error (MSE).
  
- **`XGBoost`**
  - A powerful gradient boosting model widely used for its high performance in structured data tasks.

### **`data/`**: Data Files for Model Training and Validation
This folder stores the dataset files used for training and validating the models. These files are saved in pickle (`.pkl`) format, which can be loaded into memory for use in machine learning workflows.

The following data files are stored in this directory:

- **`X.pkl`**
  - The training feature set, used as input for model training.
  
- **`X_val.pkl`**
  - The validation feature set, used to evaluate model performance during training.
  
- **`y.pkl`**
  - The training labels, corresponding to the training data for supervised learning tasks.
  
- **`y_val.pkl`**
  - The validation labels, used to evaluate the model's performance on unseen data.

---

## 🚀 How to Use the Files

To utilize these files for training or inference with your models, you can load them using Python's `pickle` library or through AutoGluon's `TabularPredictor`. Below is an example of how to load the model attributes and data for use:

```python
import pickle
from autogluon.tabular import TabularPredictor

# Example: Load the data
with open('data/X.pkl', 'rb') as f:
    X_train = pickle.load(f)

with open('data/y.pkl', 'rb') as f:
    y_train = pickle.load(f)

# Example: Load a trained model
predictor = TabularPredictor.load('attr/LightGBM')

# Predict using the loaded model
predictions = predictor.predict(X_train)

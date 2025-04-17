# Smart Budget Allocation System

## Overview

The **Smart Budget Allocation System** is a comprehensive solution designed to optimize and predict budget allocations for various ministries. The system uses machine learning to predict the allocated budgets based on historical data and other relevant factors. This prediction is crucial for ensuring transparency, better resource distribution, and efficient use of public funds.

### Key Features:
- **Budget Prediction**: Uses machine learning models to predict allocated budgets based on input data.
- **Data Reasoning**: Provides reasons for predicted budget differences (higher, lower, or matching expected budgets).
- **Real-time Visualization**: Displays real-time fund allocations and predictions on a user-friendly interface.

---

## Technologies Used

- **Flask**: A lightweight Python framework used to create the backend API for processing requests and predictions.
- **Streamlit**: A framework for building interactive, real-time web applications with minimal code, used for creating the frontend dashboard.
- **AutoGluon**: A machine learning framework used for training and predicting on tabular datasets.
- **Firebase**: A NoSQL database used to store predictions and results in real time.

---

## How the System Works

### Backend (Flask API)
- The backend is built using **Flask**, which exposes a REST API to handle incoming requests and process budget prediction queries.
- The model used for prediction is built using **AutoGluon** and stored in the server.
- Firebase is integrated to store and manage prediction results in real time.

### Frontend (Streamlit Dashboard)
- The **Streamlit** dashboard allows users to input relevant data such as ministry, priority level, region impact, and requested budget.
- After submission, the input data is sent to the backend API, where the prediction is made using the AutoGluon model.
- The predicted budget allocation and reasoning for the prediction are displayed in real-time on the Streamlit interface.

### Machine Learning Model (AutoGluon)
- The **AutoGluon** model is trained on historical data of budget allocations. The model uses various features like ministry, region impact, priority, and requested amount to predict the allocated budget.
- The trained model is stored in a specific directory and loaded when the Flask API is called.

---

## Setting Up the System

### Prerequisites
1. Python 3.8 or higher
2. Install the necessary dependencies by running:

   ```bash
   pip install -r requirements.txt

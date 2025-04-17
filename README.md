# Smart Budget Allocation System

The Smart Budget Allocation System is a data-driven platform designed to bring intelligence, transparency, and accountability to government budget allocation. It uses machine learning to predict optimal budget amounts for various ministries, integrates Firebase for real-time updates, and stores critical decisions securely on the blockchain.

---

## What It Does

- Predicts budget allocation based on historical and contextual data
- Collects project input details via mobile app and Streamlit dashboard
- Displays predictions, analytics, and reasoning in a live web dashboard
- Stores allocation hash using blockchain for immutability and auditability
- Accepts user feedback, stored securely using Firebase

---

## Technologies Used

- **Backend**: Flask API with Python
- **Machine Learning**: AutoGluon Tabular model
- **Realtime Dashboard**: Streamlit
- **Mobile App**: Built using React Native, integrated with backend and blockchain
- **Database**: Firebase Realtime Database
- **Blockchain**: Web3 + Ganache used in the app for storing final budget decisions

---

## System Flow

1. Users enter ministry project details through a mobile app or dashboard  
2. Flask backend forwards data to the ML model for prediction  
3. Prediction results, along with reasoning, are stored in Firebase  
4. Dashboard shows real-time visualizations of inputs and outputs  
5. Final approval and budget decisions are logged onto the blockchain through the app  
6. Stakeholders can provide feedback, also stored in Firebase  

---
## Screenshots of Working Model

### 1. User Dashboard
<p align="center">
  <img src="https://github.com/user-attachments/assets/c3f860b8-bb5d-47d6-8c41-ffe1066b10b1" alt="User Dashboard" width="500"/>
</p>

### 2. Admin Dashboard
<p align="center">
  <img src="https://github.com/user-attachments/assets/12da38dd-b883-4856-8853-14f73a831ce3" alt="Admin Dashboard" width="500"/>
</p>

### 3. Mobile App Interface
<p align="center">
  <img src="https://github.com/user-attachments/assets/1cb4e5ac-3f34-4a95-b217-3f35dfaf26fe" alt="Mobile App Screenshot 1" width="250"/>
  <img src="https://github.com/user-attachments/assets/9b8014f2-e2e1-48fc-9b65-a04b06334ad9" alt="Mobile App Screenshot 2" width="250"/>
</p>

# DATASET LINK
https://drive.google.com/file/d/1ah6M1ll_vJPOBowJgueww3vlHhMtfZfl/view?usp=sharing


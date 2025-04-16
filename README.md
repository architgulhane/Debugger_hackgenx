# Debugger_hackgenx
This is official Repo for HackGenx Team Debuggers
# 🧠 Smart Budget Allocation System (SBAS)

A cutting-edge, AI-powered platform for **intelligent budget allocation** across Indian government ministries — integrating **Machine Learning**, **Blockchain**, **Firebase**, and a **React Native mobile-first architecture**.

---

## 🚀 Overview

SBAS uses advanced ML models to predict budget allocations across ministries using socio-economic indicators, historical budget data, and sectoral impact metrics. The system is backed by a robust **Flask API**, and leverages **blockchain** for secure, tamper-proof logging of budget decisions.

Users can access predictions and analytics via:
- A **smart mobile app** (built in React Native)
- A responsive **admin dashboard**
- Real-time feedback channels using **Firebase**

---

## 🌟 Core Features

✅ **AI-Powered Budget Prediction**  
✅ **Blockchain Ledger Integration**  
✅ **Firebase-Driven Smart Feedback System**  
✅ **React Native Mobile App**  
✅ **Flask-Based REST API**  
✅ **Secure and Scalable**  
✅ **Real-Time Visualization & Reporting**

---

## 🧬 Technologies Used

| Layer        | Tech Stack                            |
|--------------|----------------------------------------|
| ML Engine    | `AutoGluon`, `scikit-learn`, `pandas`  |
| API Backend  | `Flask`, `Gunicorn`, `pickle`          |
| Mobile App   | `React Native`, `Expo`, `Firebase SDK` |
| Dashboard    | `React.js`, `Chart.js`, `TailwindCSS`  |
| Feedback DB  | `Firebase Realtime Database`           |
| Blockchain   | `web3.py`, `Solidity`, `Ganache`       |
| Hosting/API  | `Heroku` / `AWS EC2`                   |

---

## 📊 Dataset Summary

| Column Name           | Description |
|------------------------|-------------|
| `Ministry`             | e.g., Health, Defence |
| `Priority_Level`       | High, Medium, Low |
| `Projects_Count`       | Number of projects |
| `Region_Impact`        | Urban, Rural, All |
| `Dev_Index`            | Index from 0 to 1 |
| `Prev_Budget (Cr)`     | Last year's budget |
| `GDP_Impact (%)`       | Sector's GDP contribution |
| `Allocated_Budget (Cr)`| Target: predicted output |

---

## 🔐 Blockchain Integration

All budget decisions are **hashed and stored on the blockchain**, ensuring transparency and auditability.

Smart contracts handle:
- Budget approval and lock-in
- Stakeholder verification
- Immutable record of revisions

We use **Ganache (testnet)** and plan to scale to **Polygon or Ethereum mainnet**.

---

## 📱 Mobile Application (React Native)

**Key Features:**
- Login with Firebase Auth
- Input new project proposal data
- Get instant budget predictions
- Submit feedback (stored in Firebase)
- View ledger of approved budgets

```bash
cd sbas-mobile/
npm install
npx expo start

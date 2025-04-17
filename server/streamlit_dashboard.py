import streamlit as st
import pandas as pd
import requests
import pyrebase
import time

# Firebase configuration
firebase_config = {
    "apiKey": "AIzaSyBEfNdR0xmbQLs2nmjWgz56GXzcSFUq8pk",
    "authDomain": "hackgenx-4e89b.firebaseapp.com",
    "databaseURL": "https://hackgenx-4e89b-default-rtdb.firebaseio.com",
    "projectId": "hackgenx-4e89b",
    "storageBucket": "hackgenx-4e89b.appspot.com",
    "messagingSenderId": "559110230845",
    "appId": "1:559110230845:web:f5cba366f0d1387fe92b54",
    "measurementId": "G-GTFWC6TCDV"
}

firebase = pyrebase.initialize_app(firebase_config)
db = firebase.database()

# Dropdown options
MINISTRY_CODE_MAP = {
    'Defence': '7',
    
    'Education': '1',
    'Health': '2',
    'Agriculture': '8',
    'Railways': '7',
    'infrastructure': '3',
    'public safety': '4',
    'social welfare': '5',
}

PRIORITY_LEVEL_MAP = {
    'High': '0',
    'Medium': '5',
    'Low': '9'
}

REGION_IMPACT_MAP = {
    'Local': '0',
    'State': '1',
    'Regional': '2',
    'National': '3',
    'International': '4'
}

# UI
st.title("Budget Prediction Dashboard")

with st.form("input_form"):
    ministry = st.selectbox("Ministry", list(MINISTRY_CODE_MAP.keys()))
    priority = st.selectbox("Priority Level", list(PRIORITY_LEVEL_MAP.keys()))
    region_impact = st.selectbox("Region Impact", list(REGION_IMPACT_MAP.keys()))
    development_index = st.selectbox("Development Index", ["High", "Medium", "Low"])
    prev_budget = st.number_input("Previous Budget (Cr)", min_value=0.0)
    expected_budget = st.number_input("Expected Budget (Cr)", min_value=0.0)
    
    submitted = st.form_submit_button("Submit")

if submitted:
    # Mapping for development index
    dev_index = {"High": 0, "Medium": 1, "Low": 2}[development_index]
    
    # Prepare the input data according to the Flask API's expectations
    input_data = {
        "Dev_Index": dev_index,
        "GDP_Impact (%)": 34,
        "Ministry": MINISTRY_CODE_MAP[ministry],
        "Prev_Budget (Cr)": prev_budget,
        "Priority_Level": PRIORITY_LEVEL_MAP[priority],
        "Projects_Count": 10,
        "Region_Impact": REGION_IMPACT_MAP[region_impact],
        "expected_budget": expected_budget  # Lowercase as expected by the API
    }
    
    # Display the data being sent for debugging
    st.write("Sending data:", input_data)
    
    # Send data to the Flask API
    with st.spinner("Sending request..."):
        try:
            # The API expects a list of data items, not wrapped in an "input" key
            res = requests.post("http://127.0.0.1:5000/predict", json=[input_data])
            
            # Debug response
            st.write(f"Response status code: {res.status_code}")
            
            if res.status_code != 200:
                st.error(f"Error: HTTP status code {res.status_code}")
                st.write("Response content:", res.text)
            else:
                output = res.json()
                
                # Display the prediction response
                if isinstance(output, list) and len(output) > 0:
                    result = output[0]
                    st.success("Prediction Successful!")
                    st.metric("Predicted Budget", f"₹{result['Predicted_Allocated_Budget']:.2f} Cr")
                    st.write("Reason:", result["Reason"])
                    
                    # Display full result for debugging
                    with st.expander("See complete result"):
                        st.write(result)
                else:
                    st.error(f"Unexpected response format: {output}")
        except Exception as e:
            st.error(f"Error: {str(e)}")

# Realtime Firebase Viewer
st.subheader("📊 Real-time Predictions")

def fetch_predictions():
    try:
        data = db.child("predictions").get()
        if data.val():
            predictions_data = data.val()
            df_data = [v for v in predictions_data.values()]
            return pd.DataFrame(df_data)
        return pd.DataFrame()
    except Exception as e:
        st.error(f"Error fetching predictions: {str(e)}")
        return pd.DataFrame()

# Add a refresh button
if st.button("Refresh Data"):
    st.experimental_rerun()

# Display predictions
df = fetch_predictions()
if not df.empty:
    st.dataframe(df)
else:
    st.write("No predictions available.")

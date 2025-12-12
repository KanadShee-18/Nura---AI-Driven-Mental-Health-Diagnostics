from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
import pandas as pd
import joblib
import os
from dotenv import load_dotenv
from data_utils import clean_gender

# Load environment variables
load_dotenv()

app = FastAPI(title="Mental Health Diagnostics API")

# Get the directory of the current file (api.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Path to models directory
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')

# loading all the models here so we don't have to do it every time
print("Loading models...")
try:
    condition_model = joblib.load(os.path.join(MODELS_DIR, 'condition_model.pkl'))
    treatment_model = joblib.load(os.path.join(MODELS_DIR, 'treatment_model.pkl'))
    le_condition = joblib.load(os.path.join(MODELS_DIR, 'le_condition.pkl'))
    le_treatment = joblib.load(os.path.join(MODELS_DIR, 'le_treatment.pkl'))
    encoders = joblib.load(os.path.join(MODELS_DIR, 'encoders.pkl'))
    feature_cols = joblib.load(os.path.join(MODELS_DIR, 'feature_cols.pkl'))
    print("Models loaded successfully.")
except FileNotFoundError:
    print("Error: Models not found. Please run train_model.py first.")

class PatientData(BaseModel):
    Age: str  # using string for age just in case
    Gender: str
    work_interfere: str
    family_history: str
    benefits: str
    care_options: str
    anonymity: str
    leave: str
    mental_health_consequence: str
    self_employed: str
    coworkers: str
    supervisor: str
    mental_health_interview: str

@app.get("/")
def read_root():
    return {"message": "Mental Health Diagnostics API is running"}

@app.post("/predict")
def predict_condition(data: PatientData, x_api_key: str = Header(None)):
    # Security check
    secret_key = os.getenv("API_SECRET_KEY")
    if secret_key and x_api_key != secret_key:
        raise HTTPException(status_code=403, detail="Unauthorized access")
        
    # making it a dict
    input_data = data.model_dump()
    
    # Create DataFrame
    df = pd.DataFrame([input_data])
    
    # --- doing the same preprocessing stuff as before ---
    
    # 1. fixing gender inputs
    if 'Gender' in df.columns:
        df['Gender'] = df['Gender'].apply(clean_gender)
        
    # 2. fixing age
    if 'Age' in df.columns:
        df['Age'] = pd.to_numeric(df['Age'], errors='coerce')
        # Fill with default if invalid
        df['Age'] = df['Age'].fillna(30)
        
    # 3. encoding the categories
    for col, le in encoders.items():
        if col in df.columns:
            # if we haven't seen this before, mark as unknown
            df[col] = df[col].fillna('Unknown')
            
            # helper function to avoid crashes
            known_labels = set(le.classes_)
            def safe_transform(val):
                if val in known_labels:
                    return le.transform([val])[0]
                else:
                    if 'Unknown' in known_labels:
                        return le.transform(['Unknown'])[0]
                    return 0 # Fallback
            
            df[col] = df[col].apply(safe_transform)

    # making sure columns are right
    # Add missing columns if any (though Pydantic ensures we get what we expect)
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0
            
    X = df[feature_cols]
    
    # --- time to predict! ---
    try:
        # Condition
        cond_idx = condition_model.predict(X)[0]
        condition = le_condition.inverse_transform([cond_idx])[0]
        
        # Treatment
        treat_idx = treatment_model.predict(X)[0]
        treatment = le_treatment.inverse_transform([treat_idx])[0]
        
        return {
            "predicted_condition": condition,
            "treatment_needed": treatment
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

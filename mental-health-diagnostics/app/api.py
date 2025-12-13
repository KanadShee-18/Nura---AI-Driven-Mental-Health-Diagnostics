from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os
from dotenv import load_dotenv
from data_utils import clean_gender, preprocess_input

# Load environment variables
load_dotenv()

app = FastAPI(title="Mental Health Diagnostics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://nura-ai-diagnostics.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    # anonymity: str
    leave: str
    mental_health_consequence: str
    self_employed: str
    # coworkers: str
    # supervisor: str
    mental_health_interview: str
    yoga: str

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
    df = preprocess_input(df, encoders)

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

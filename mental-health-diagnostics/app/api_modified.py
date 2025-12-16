from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os
from dotenv import load_dotenv

try:
    from app.data_utils_modified import clean_gender, preprocess_input
except ImportError:
    from data_utils_modified import clean_gender, preprocess_input

# Load environment variables
load_dotenv()

app = FastAPI(title="Mental Health Diagnostics API (Modified)")

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
    treatment_model = joblib.load(os.path.join(MODELS_DIR, 'treatment_model_modified.pkl'))
    le_treatment = joblib.load(os.path.join(MODELS_DIR, 'le_treatment_modified.pkl'))
    encoders = joblib.load(os.path.join(MODELS_DIR, 'encoders_modified.pkl'))
    feature_cols = joblib.load(os.path.join(MODELS_DIR, 'feature_cols_modified.pkl'))
    print("Models loaded successfully.")
except FileNotFoundError:
    print("Error: Models not found. Please run train_model_modified.py first.")

class PatientData(BaseModel):
    Gender: str
    Occupation: str
    SelfEmployed: str
    FamilyHistory: str
    MentalHealthHistory: str
    DaysIndoors: str
    HabitsChange: str
    IncreasingStress: str
    SocialWeakness: str
    CopingStruggles: str
    WorkInterest: str
    MentalHealthInterview: str
    CareOptions: str
    MoodSwings: str = "Medium" # Default value if not provided

@app.get("/")
def read_root():
    return {"message": "Mental Health Diagnostics API (Modified) is running"}

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
        # Treatment
        treat_idx = treatment_model.predict(X)[0]
        treatment = le_treatment.inverse_transform([treat_idx])[0]
        
        return {
            "success": True,
            "treatment_needed": treatment
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

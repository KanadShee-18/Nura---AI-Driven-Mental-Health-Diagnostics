from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
from data_utils import clean_gender

app = FastAPI(title="Mental Health Diagnostics API")

# Load models and encoders once at startup
print("Loading models...")
try:
    condition_model = joblib.load('../models/condition_model.pkl')
    treatment_model = joblib.load('../models/treatment_model.pkl')
    le_condition = joblib.load('../models/le_condition.pkl')
    le_treatment = joblib.load('../models/le_treatment.pkl')
    encoders = joblib.load('../models/encoders.pkl')
    feature_cols = joblib.load('../models/feature_cols.pkl')
    print("Models loaded successfully.")
except FileNotFoundError:
    print("Error: Models not found. Please run train_model.py first.")
    # We don't raise an error here to allow the app to start, 
    # but predictions will fail if models aren't loaded.

class PatientData(BaseModel):
    Age: str  # Receiving as string to handle potential non-numeric input gracefully
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
def predict_condition(data: PatientData):
    # Convert Pydantic model to dict
    input_data = data.model_dump()
    
    # Create DataFrame
    df = pd.DataFrame([input_data])
    
    # --- Preprocessing (Same as predict.py) ---
    
    # 1. Clean Gender
    if 'Gender' in df.columns:
        df['Gender'] = df['Gender'].apply(clean_gender)
        
    # 2. Handle Age
    if 'Age' in df.columns:
        df['Age'] = pd.to_numeric(df['Age'], errors='coerce')
        # Fill with default if invalid
        df['Age'] = df['Age'].fillna(30)
        
    # 3. Encode categorical
    for col, le in encoders.items():
        if col in df.columns:
            # Handle unseen labels
            df[col] = df[col].fillna('Unknown')
            
            # Safe transform helper
            known_labels = set(le.classes_)
            def safe_transform(val):
                if val in known_labels:
                    return le.transform([val])[0]
                else:
                    if 'Unknown' in known_labels:
                        return le.transform(['Unknown'])[0]
                    return 0 # Fallback
            
            df[col] = df[col].apply(safe_transform)

    # Ensure columns are in the correct order
    # Add missing columns if any (though Pydantic ensures we get what we expect)
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0
            
    X = df[feature_cols]
    
    # --- Prediction ---
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

import pandas as pd
import numpy as np
import joblib
from data_utils import clean_gender

def get_user_input(feature_cols, encoders):
    input_data = {}
    print("\nPlease answer the following questions to help us predict the condition:")
    
    # Mapping technical column names to user-friendly questions
    questions = {
        'Age': "What is your age?",
        'Gender': "What is your gender? (Male/Female/Other)",
        'work_interfere': "How often does your mental health interfere with your work? (Often/Rarely/Never/Sometimes)",
        'family_history': "Do you have a family history of mental illness? (Yes/No)",
        'benefits': "Does your employer provide mental health benefits? (Yes/No/Don't know)",
        'care_options': "Do you know the options for mental health care your employer provides? (Yes/No/Not sure)",
        'anonymity': "Is your anonymity protected if you choose to take advantage of mental health resources? (Yes/No/Don't know)",
        'leave': "How easy is it for you to take medical leave for a mental health condition? (Very easy/Somewhat easy/Somewhat difficult/Very difficult/Don't know)",
        'mental_health_consequence': "Do you think that discussing a mental health issue with your employer would have negative consequences? (Yes/No/Maybe)",
        'self_employed': "Are you self-employed? (Yes/No)",
        'coworkers': "Would you be willing to discuss a mental health issue with your coworkers? (Yes/No/Some of them)",
        'supervisor': "Would you be willing to discuss a mental health issue with your direct supervisor? (Yes/No/Some of them)",
        'mental_health_interview': "Would you bring up a mental health issue with a potential employer in an interview? (Yes/No/Maybe)"
    }

    for col in feature_cols:
        # Use the custom question if available, otherwise default to the column name
        prompt = questions.get(col, f"Enter value for {col}")
        val = input(f"{prompt}: ")
        input_data[col] = val
        
    return input_data

def predict():
    print("Loading models...")
    try:
        condition_model = joblib.load('../models/condition_model.pkl')
        treatment_model = joblib.load('../models/treatment_model.pkl')
        le_condition = joblib.load('../models/le_condition.pkl')
        le_treatment = joblib.load('../models/le_treatment.pkl')
        encoders = joblib.load('../models/encoders.pkl')
        feature_cols = joblib.load('../models/feature_cols.pkl')
    except FileNotFoundError:
        print("Models not found. Please run train_model.py first.")
        return

    # Get input
    user_input = get_user_input(feature_cols, encoders)
    
    # Create DataFrame
    df = pd.DataFrame([user_input])
    
    # Preprocess
    # 1. Clean Gender
    if 'Gender' in df.columns:
        df['Gender'] = df['Gender'].apply(clean_gender)
        
    # 2. Handle Age
    if 'Age' in df.columns:
        df['Age'] = pd.to_numeric(df['Age'], errors='coerce')
        # Fill with median if invalid (we don't have the median saved, so we'll use a reasonable default or just 30)
        df['Age'] = df['Age'].fillna(30)
        
    # 3. Encode categorical
    for col, le in encoders.items():
        if col in df.columns:
            # Handle unseen labels
            df[col] = df[col].fillna('Unknown')
            df[col] = df[col].apply(lambda x: x if x in le.classes_ else 'Unknown')
            
            # If 'Unknown' is not in classes, we have a problem. 
            # We should have ensured 'Unknown' is in classes during training or have a fallback.
            # In data_utils.py we filled NaNs with 'Unknown' before fitting, so 'Unknown' should be in classes if there were NaNs.
            # If there were no NaNs, 'Unknown' might not be there.
            # Fallback: map to the first class index (0) or mode.
            
            known_labels = set(le.classes_)
            
            def safe_transform(val):
                if val in known_labels:
                    return le.transform([val])[0]
                else:
                    # Try 'Unknown'
                    if 'Unknown' in known_labels:
                        return le.transform(['Unknown'])[0]
                    # Else return first class
                    return 0
            
            df[col] = df[col].apply(safe_transform)
            
    # Ensure all columns are present and in correct order
    # (They should be since we iterated feature_cols)
    X = df[feature_cols]
    
    # Predict
    print("\n--- Prediction Results ---")
    
    # Condition
    cond_idx = condition_model.predict(X)[0]
    condition = le_condition.inverse_transform([cond_idx])[0]
    print(f"Predicted Condition: {condition}")
    
    # Treatment
    treat_idx = treatment_model.predict(X)[0]
    treatment = le_treatment.inverse_transform([treat_idx])[0]
    print(f"Treatment Needed: {treatment}")

if __name__ == "__main__":
    predict()

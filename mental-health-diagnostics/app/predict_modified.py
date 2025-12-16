import pandas as pd
import numpy as np
import joblib
import os
from data_utils_modified import clean_gender, preprocess_input

def get_user_input(feature_cols, encoders):
    input_data = {}
    print("\nPlease answer the following questions to help us predict your mental health status:")

    questions = {
        'Gender': "What is your gender? (Male/Female/Other)",
        'Occupation': "What is your occupation? (Student/Corporate/Business/Housewife/Others)",
        'SelfEmployed': "Are you self-employed? (Yes/No)",
        'FamilyHistory': "Do you have a family history of mental illness? (Yes/No)",
        'MentalHealthHistory': "Do you have a past history of mental health issues? (Yes/No/Maybe)",
        'DaysIndoors': "How many days do you typically spend indoors? (1-14 days/15-30 days/31-60 days/More than 2 months/Go out Every day)",
        'HabitsChange': "Have you noticed any significant changes in your habits? (Yes/No/Maybe)",
        'IncreasingStress': "Do you feel your stress levels are increasing? (Yes/No/Maybe)",
        'SocialWeakness': "Do you feel socially weak or isolated? (Yes/No/Maybe)",
        'CopingStruggles': "Do you struggle with coping with daily problems? (Yes/No)",
        'WorkInterest': "Do you still find interest in your work? (Yes/No/Maybe)",
        'MentalHealthInterview': "Would you bring up a mental health issue in an interview? (Yes/No/Maybe)",
        'CareOptions': "Are you aware of mental health care options? (Yes/No/Not sure)",
        'MoodSwings': "How would you describe your mood swings? (Low/Medium/High)"
    }

    for col in feature_cols:
        # Use the custom question if available, otherwise default to the column name
        prompt = questions.get(col, f"Enter value for {col}")
        val = input(f"{prompt}: ")
        input_data[col] = val
        
    return input_data

def predict():
    # Get base dir
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')

    print("Loading models...")
    try:
        treatment_model = joblib.load(os.path.join(MODELS_DIR, 'treatment_model_modified.pkl'))
        le_treatment = joblib.load(os.path.join(MODELS_DIR, 'le_treatment_modified.pkl'))
        encoders = joblib.load(os.path.join(MODELS_DIR, 'encoders_modified.pkl'))
        feature_cols = joblib.load(os.path.join(MODELS_DIR, 'feature_cols_modified.pkl'))
    except FileNotFoundError:
        print("Models not found. Please run train_model_modified.py first.")
        return

    # Get input
    user_input = get_user_input(feature_cols, encoders)
    
    # Create DataFrame
    df = pd.DataFrame([user_input])
    
    # Preprocess
    df = preprocess_input(df, encoders)
            
    # maintaning correct order
    X = df[feature_cols]
    
    print("\n--- Prediction Results ---")
    
    treat_idx = treatment_model.predict(X)[0]
    treatment = le_treatment.inverse_transform([treat_idx])[0]
    print(f"Treatment Needed: {treatment}")

if __name__ == "__main__":
    predict()

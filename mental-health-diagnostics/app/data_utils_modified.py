import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import joblib
import re

def clean_gender(gender):
    gender = str(gender).lower().strip()
    if gender in ['male', 'm', 'male-ish', 'maile', 'cis male', 'mal', 'male (cis)', 'make', 'male ', 'man', 'msle', 'mail', 'malr', 'cis man', 'guy (-ish) ^_^']:
        return 'Male'
    if gender in ['female', 'f', 'woman', 'femake', 'female ', 'cis-female/femme', 'female (cis)', 'femail', 'cis female', 'trans-female', 'trans woman', 'female (trans)']:
        return 'Female'
    return 'Other'

def preprocess_data(filepath, encoders_path='../models/encoders_modified.pkl', is_training=True):
    df = pd.read_csv(filepath)
    
    # Handle duplicate columns (specifically SocialWeakness)
    df = df.loc[:, ~df.columns.duplicated()]
    
    # Clean Gender
    df['Gender'] = df['Gender'].apply(clean_gender)
    
    # Columns to encode (Updated for new dataset)
    # Excluded 'Country' as requested
    categorical_cols = ['Gender', 'Occupation', 'SelfEmployed', 'FamilyHistory', 
                        'MentalHealthHistory', 'DaysIndoors', 'HabitsChange', 
                        'IncreasingStress', 'SocialWeakness', 'CopingStruggles', 
                        'WorkInterest', 'MentalHealthInterview', 'CareOptions', 'MoodSwings']
    
    # Filter only columns that exist in the dataframe
    existing_cat_cols = [col for col in categorical_cols if col in df.columns]
    
    encoders = {}
    if not is_training:
        try:
            encoders = joblib.load(encoders_path)
        except:
            print("Encoders not found. Please train the model first.")
            return None, None

    for col in existing_cat_cols:
        df[col] = df[col].fillna('Unknown')
        if is_training:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            encoders[col] = le
        else:
            if col in encoders:
                le = encoders[col]
                # Handle unseen labels
                df[col] = df[col].map(lambda s: s if s in le.classes_ else 'Unknown')
                
                # Safe transform
                known_labels = set(le.classes_)
                # If value is not in known labels, pick the first one (or handle better if needed)
                # Here we just ensure it doesn't crash
                df[col] = df[col].apply(lambda x: x if x in known_labels else list(known_labels)[0]) 
                df[col] = le.transform(df[col].astype(str))
    
    if is_training:
        joblib.dump(encoders, encoders_path)
        
    return df, encoders

def preprocess_input(df, encoders):
    # 1. Clean Gender
    if 'Gender' in df.columns:
        df['Gender'] = df['Gender'].apply(clean_gender)
        
    # 2. Encode categorical
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
                    # Fallback to a known label or 0
                    if 'Unknown' in known_labels:
                        return le.transform(['Unknown'])[0]
                    return 0 
            
            df[col] = df[col].apply(safe_transform)
    return df

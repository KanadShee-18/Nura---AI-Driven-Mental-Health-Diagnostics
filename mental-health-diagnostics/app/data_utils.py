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

def preprocess_data(filepath, encoders_path='../models/encoders.pkl', is_training=True):
    df = pd.read_csv(filepath)
    
    # Clean Gender
    df['Gender'] = df['Gender'].apply(clean_gender)
    
    # Handle missing values (simple imputation)
    # For categorical, fill with mode or 'Unknown'
    # For numerical (Age), fill with median
    
    # Fix Age outliers
    df['Age'] = pd.to_numeric(df['Age'], errors='coerce')
    median_age = df['Age'].median()
    df['Age'] = df['Age'].fillna(median_age)
    # Filter unrealistic ages
    df.loc[(df['Age'] < 18) | (df['Age'] > 100), 'Age'] = median_age
    
    # Columns to encode
    categorical_cols = ['Gender', 'self_employed', 'family_history', 'work_interfere', 'no_employees', 
                        'remote_work', 'tech_company', 'benefits', 'care_options', 'wellness_program', 
                        'seek_help', 'anonymity', 'leave', 'mental_health_consequence', 
                        'phys_health_consequence', 'coworkers', 'supervisor', 
                        'mental_health_interview', 'phys_health_interview', 
                        'mental_vs_physical', 'obs_consequence']
    
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
                # If 'Unknown' was not in training, we might have an issue. 
                # For simplicity, we map to the first class or a specific 'Unknown' class if it existed.
                # A robust way is to fit on data + 'Unknown' initially.
                # Here we will just use transform and handle errors or use a custom safe transform.
                
                # Safe transform
                known_labels = set(le.classes_)
                df[col] = df[col].apply(lambda x: x if x in known_labels else known_labels.pop()) # Fallback to a known label
                df[col] = le.transform(df[col].astype(str))
    
    if is_training:
        joblib.dump(encoders, encoders_path)
        
    return df, encoders

import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, accuracy_score
import joblib
from data_utils_modified import preprocess_data

def train():
    # Get base dir
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_DIR = os.path.join(BASE_DIR, '..', 'data')
    MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')

    print("Loading and preprocessing data...")
    # Use the new dataset
    df, encoders = preprocess_data(os.path.join(DATA_DIR, 'Mental Health dataset.csv'), encoders_path=os.path.join(MODELS_DIR, 'encoders_modified.pkl'), is_training=True)
    
    # Define targets
    target_cols = ['Treatment']
    
    # Define features: Use only the columns that were encoded (numeric)
    # This automatically excludes 'Country' and targets (since they weren't in categorical_cols of data_utils)
    feature_cols = list(encoders.keys())
    
    print(f"Training with features: {feature_cols}")
    
    X = df[feature_cols]
    joblib.dump(feature_cols, os.path.join(MODELS_DIR, 'feature_cols_modified.pkl'))
    
    y_treatment = df['Treatment']
    
    # Encode targets
    le_treatment = LabelEncoder()
    y_treatment_encoded = le_treatment.fit_transform(y_treatment)
    
    # Save target encoders
    joblib.dump(le_treatment, os.path.join(MODELS_DIR, 'le_treatment_modified.pkl'))
    
    # Hyperparameter tuning
    param_grid = {
        'n_estimators': [100, 200],
        'max_depth': [None, 10, 20],
        'min_samples_split': [2, 5],
        'min_samples_leaf': [1, 2]
    }
    
    # --- Training Treatment Model ---
    print("\nTraining Treatment Model (Supervised with Tuning)...")
    
    X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(X, y_treatment_encoded, test_size=0.2, random_state=42)
    
    rf_treatment = RandomForestClassifier(random_state=42, class_weight='balanced')
    
    # Reusing the same grid
    grid_search_t = GridSearchCV(estimator=rf_treatment, param_grid=param_grid, cv=3, n_jobs=-1, verbose=1)
    grid_search_t.fit(X_train_t, y_train_t)
    
    best_rf_t = grid_search_t.best_estimator_
    print(f"Best parameters for Treatment Model: {grid_search_t.best_params_}")
    
    y_pred_t = best_rf_t.predict(X_test_t)
    print("Treatment Model Accuracy:", accuracy_score(y_test_t, y_pred_t))
    print(classification_report(y_test_t, y_pred_t, target_names=le_treatment.classes_, zero_division=0))
    
    joblib.dump(best_rf_t, os.path.join(MODELS_DIR, 'treatment_model_modified.pkl'))
    
    print("\nModels and encoders saved successfully.")


if __name__ == "__main__":
    train()

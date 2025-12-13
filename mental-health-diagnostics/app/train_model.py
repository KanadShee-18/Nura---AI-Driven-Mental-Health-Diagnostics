import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, accuracy_score
import joblib
from data_utils import preprocess_data

def train():
    # Get base dir
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_DIR = os.path.join(BASE_DIR, '..', 'data')
    MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')

    print("Loading and preprocessing data...")
    df, encoders = preprocess_data(os.path.join(DATA_DIR, 'dataset.csv'), encoders_path=os.path.join(MODELS_DIR, 'encoders.pkl'), is_training=True)
    
    # Define targets and features
    target_cols = ['condition', 'treatment']
    feature_cols = [col for col in df.columns if col not in target_cols]
    
    X = df[feature_cols]
    joblib.dump(feature_cols, os.path.join(MODELS_DIR, 'feature_cols.pkl'))
    y_condition = df['condition']
    y_treatment = df['treatment']
    
    # Encode targets
    le_condition = LabelEncoder()
    y_condition_encoded = le_condition.fit_transform(y_condition)
    
    le_treatment = LabelEncoder()
    y_treatment_encoded = le_treatment.fit_transform(y_treatment)
    
    # Save target encoders
    joblib.dump(le_condition, os.path.join(MODELS_DIR, 'le_condition.pkl'))
    joblib.dump(le_treatment, os.path.join(MODELS_DIR, 'le_treatment.pkl'))
    
    # --- Training Condition Model ---
    print("\nTraining Condition Model (Supervised with Tuning)...")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y_condition_encoded, test_size=0.2, random_state=42)
    
    # Using RandomForest with class_weight='balanced' to handle imbalance
    rf = RandomForestClassifier(random_state=42, class_weight='balanced')
    
    # Hyperparameter tuning
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    
    grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=3, n_jobs=-1, verbose=1)
    grid_search.fit(X_train, y_train)
    
    best_rf = grid_search.best_estimator_
    print(f"Best parameters for Condition Model: {grid_search.best_params_}")
    
    y_pred = best_rf.predict(X_test)
    print("Condition Model Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred, target_names=le_condition.classes_, zero_division=0))
    
    joblib.dump(best_rf, os.path.join(MODELS_DIR, 'condition_model.pkl'))
    
    # --- Training Treatment Model ---
    print("\nTraining Treatment Model (Supervised with Tuning)...")
    
    X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(X, y_treatment_encoded, test_size=0.2, random_state=42)
    
    rf_treatment = RandomForestClassifier(random_state=42, class_weight='balanced')
    
    # Reusing the same grid for simplicity, or could define a smaller one
    grid_search_t = GridSearchCV(estimator=rf_treatment, param_grid=param_grid, cv=3, n_jobs=-1, verbose=1)
    grid_search_t.fit(X_train_t, y_train_t)
    
    best_rf_t = grid_search_t.best_estimator_
    print(f"Best parameters for Treatment Model: {grid_search_t.best_params_}")
    
    y_pred_t = best_rf_t.predict(X_test_t)
    print("Treatment Model Accuracy:", accuracy_score(y_test_t, y_pred_t))
    print(classification_report(y_test_t, y_pred_t, target_names=le_treatment.classes_, zero_division=0))
    
    joblib.dump(best_rf_t, os.path.join(MODELS_DIR, 'treatment_model.pkl'))
    
    print("\nModels and encoders saved successfully.")


if __name__ == "__main__":
    train()

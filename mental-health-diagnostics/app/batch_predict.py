import pandas as pd
import joblib
from data_utils import clean_gender

def batch_predict(input_file='../data/unlabeled_data.csv', output_file='../data/predictions.csv'):
    print(f"Loading data from {input_file}...")
    try:
        df = pd.read_csv(input_file)
    except FileNotFoundError:
        print(f"File {input_file} not found.")
        return

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

    # Ensure all feature columns are present
    # If the CSV is missing some columns that were in training, we need to handle it.
    # For this demo, we assume the CSV has the correct columns.
    
    X = df.copy()
    
    # Preprocess
    # 1. Clean Gender
    if 'Gender' in X.columns:
        X['Gender'] = X['Gender'].apply(clean_gender)
        
    # 2. Handle Age
    if 'Age' in X.columns:
        X['Age'] = pd.to_numeric(X['Age'], errors='coerce')
        X['Age'] = X['Age'].fillna(30)
        
    # 3. Encode categorical
    for col, le in encoders.items():
        if col in X.columns:
            # Handle unseen labels
            X[col] = X[col].fillna('Unknown')
            
            # Safe transform helper
            known_labels = set(le.classes_)
            def safe_transform(val):
                if val in known_labels:
                    return le.transform([val])[0]
                else:
                    if 'Unknown' in known_labels:
                        return le.transform(['Unknown'])[0]
                    return 0 # Fallback
            
            X[col] = X[col].apply(safe_transform)

    # Reorder columns to match training
    # Add missing columns with default values if necessary
    for col in feature_cols:
        if col not in X.columns:
            X[col] = 0 # Or appropriate default
            
    X = X[feature_cols]
    
    # Predict
    print("Predicting...")
    cond_idxs = condition_model.predict(X)
    treat_idxs = treatment_model.predict(X)
    
    conditions = le_condition.inverse_transform(cond_idxs)
    treatments = le_treatment.inverse_transform(treat_idxs)
    
    # Add predictions to original dataframe
    df['Predicted_Condition'] = conditions
    df['Treatment_Needed'] = treatments
    
    print("\n--- Prediction Results ---")
    print(df[['Age', 'Gender', 'Predicted_Condition', 'Treatment_Needed']])
    
    df.to_csv(output_file, index=False)
    print(f"\nFull results saved to {output_file}")

if __name__ == "__main__":
    batch_predict()

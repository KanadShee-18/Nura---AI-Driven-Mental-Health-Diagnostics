import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.semi_supervised import SelfTrainingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
from data_utils import preprocess_data


def train():
    print("Loading and preprocessing data...")
    df, encoders = preprocess_data('../data/modified_dataset_with_condition.csv', encoders_path='../models/encoders.pkl', is_training=True)
    
    # Define targets and features
    target_cols = ['condition', 'treatment']
    feature_cols = [col for col in df.columns if col not in target_cols]
    
    X = df[feature_cols]
    joblib.dump(feature_cols, '../models/feature_cols.pkl')
    y_condition = df['condition']
    y_treatment = df['treatment']
    
    # Encode targets
    le_condition = LabelEncoder()
    y_condition_encoded = le_condition.fit_transform(y_condition)
    
    le_treatment = LabelEncoder()
    y_treatment_encoded = le_treatment.fit_transform(y_treatment)
    
    # Save target encoders
    joblib.dump(le_condition, '../models/le_condition.pkl')
    joblib.dump(le_treatment, '../models/le_treatment.pkl')
    
    # training the first model for condition
    print("\nTraining Condition Model (Semi-Supervised)...")
    
    # splitting data
    X_train, X_test, y_train, y_test = train_test_split(X, y_condition_encoded, test_size=0.2, random_state=42)
    
    # pretending some data is unlabeled to test semi-supervised learning
    rng = np.random.RandomState(42)
    random_unlabeled_points = rng.rand(len(y_train)) < 0.5
    y_train_mixed = np.copy(y_train)
    y_train_mixed[random_unlabeled_points] = -1
    
    print(f"Labeled samples: {np.sum(y_train_mixed != -1)}")
    print(f"Unlabeled samples: {np.sum(y_train_mixed == -1)}")
    
    # using random forest
    rf = RandomForestClassifier(n_estimators=200, random_state=42)
    
    # self training stuff
    # had to change base_estimator to estimator because sklearn updated
    st_clf = SelfTrainingClassifier(estimator=rf, criterion='k_best', k_best=10, max_iter=10)
    st_clf.fit(X_train, y_train_mixed)
    
    # checking how good it is
    y_pred = st_clf.predict(X_test)
    print("Condition Model Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred, target_names=le_condition.classes_, zero_division=0))
    
    # saving it for later
    joblib.dump(st_clf, '../models/condition_model.pkl')
    
    # training the treatment model now
    print("\nTraining Treatment Model...")
    # just doing normal supervised learning here
    # keeping it simple for treatment prediction
    X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(X, y_treatment_encoded, test_size=0.2, random_state=42)
    
    rf_treatment = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_treatment.fit(X_train_t, y_train_t)
    
    y_pred_t = rf_treatment.predict(X_test_t)
    print("Treatment Model Accuracy:", accuracy_score(y_test_t, y_pred_t))
    print(classification_report(y_test_t, y_pred_t, target_names=le_treatment.classes_, zero_division=0))
    
    joblib.dump(rf_treatment, '../models/treatment_model.pkl')
    
    print("\nModels and encoders saved successfully.")


if __name__ == "__main__":
    train()

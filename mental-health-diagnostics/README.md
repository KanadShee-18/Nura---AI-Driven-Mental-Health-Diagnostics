# Mental Health Diagnostics Semi-Supervised Learning Model

This project implements a semi-supervised learning model to detect mental health conditions and predict if treatment is needed.

## Project Structure

- `modified_dataset_with_condition.csv`: The dataset used for training.
- `data_utils.py`: Contains functions for data cleaning, preprocessing, and encoding.
- `train_model.py`: Script to train the models. It simulates semi-supervised learning by masking some labels and using `SelfTrainingClassifier`.
- `predict.py`: Interactive script to predict condition and treatment need for new user inputs.
- `requirements.txt`: List of dependencies.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### 1. Train the Model

Run the training script to process the data and train the Random Forest models.

```bash
python train_model.py
```

This will save the trained models (`condition_model.pkl`, `treatment_model.pkl`) and encoders (`encoders.pkl`, etc.).

### 2. Predict

Run the prediction script to interactively input data and get a diagnosis.

```bash
python predict.py
```

Follow the prompts to enter details like Age, Gender, Family History, etc.

### 3. Run API Server

To host the model as a REST API (for backend integration):

```bash
python api.py
```

The API will start at `http://localhost:8000`.

- **Swagger UI:** Go to `http://localhost:8000/docs` to test the API interactively.
- **Endpoint:** `POST /predict`

## Methodology

- **Semi-Supervised Learning**: The `condition` model uses a `SelfTrainingClassifier` with a `RandomForestClassifier` base. It is trained on a mix of labeled and simulated unlabeled data (labels masked) to demonstrate semi-supervised capabilities.
- **Supervised Learning**: The `treatment` model uses a standard `RandomForestClassifier`.

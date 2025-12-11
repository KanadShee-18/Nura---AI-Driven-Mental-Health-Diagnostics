# Mental Health Diagnostics Platform

This repository contains the source code for a comprehensive Mental Health Diagnostics application. It is composed of a machine learning backend for diagnostics and a modern web frontend.

## Project Structure

The project is divided into two main directories:

### 1. `mental-health-diagnostics/` (Backend & ML)

A Python-based machine learning component that uses semi-supervised learning to detect mental health conditions and predict treatment needs.

- **Tech Stack:** Python, Scikit-learn, FastAPI.
- **Key Features:**
  - Semi-supervised learning using `SelfTrainingClassifier`.
  - REST API for serving predictions.
  - Scripts for training and batch prediction.
- **Setup:**
  ```bash
  cd mental-health-diagnostics
  pip install -r requirements.txt
  python app/api.py
  ```

### 2. `nura/` (Frontend)

A modern web interface built with Next.js to interact with the diagnostics model.

- **Tech Stack:** Next.js, React, TypeScript, Tailwind CSS.
- **Key Features:**
  - User-friendly interface for inputting health data.
  - Real-time interaction with the backend API.
- **Setup:**
  ```bash
  cd nura
  npm install
  npm run dev
  ```

## Getting Started

To run the full application locally, you will need to start both the backend server and the frontend client.

1. **Start the Backend:**
   Navigate to `mental-health-diagnostics/` and run the API server. It will typically run on `http://localhost:8000`.

2. **Start the Frontend:**
   Navigate to `nura/` and start the development server. It will typically run on `http://localhost:3000`.

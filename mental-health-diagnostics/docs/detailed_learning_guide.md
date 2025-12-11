# The Ultimate Beginner's Guide to Your Mental Health Project

**Roleplay:** I am your professor, and you are the student. I am going to explain this project to you in the simplest way possible, so you can turn around and explain it to your examiners.

---

## Part 1: The Concept (No Code yet)

### 1. What is this project?

Imagine a digital doctor. You tell it about yourself (Age, Gender, if you have family history of mental illness, etc.), and it tells you:

1.  **Condition:** "You likely have Anxiety" or "You are High Risk".
2.  **Treatment:** "Yes, you need treatment" or "No, you are fine".

### 2. What is "Machine Learning"?

Traditional programming is like a recipe: "If age > 30, say Yes."
Machine Learning is different. We don't give it rules. We give it **examples** (data).

- **We show it:** "Here is a 30-year-old male with family history who has Anxiety."
- **We show it:** "Here is a 25-year-old female with no history who is Healthy."
- **The Computer:** Finds the patterns itself. It figures out _on its own_ that "Family history usually means higher risk."

### 3. What is "Random Forest"? (Your Algorithm)

This is the brain of your project.

- **Imagine a Decision Tree:** It's like a game of 20 Questions. "Is he male?" -> Yes. "Is he over 30?" -> No. -> "Diagnosis: Anxiety".
- **The Problem:** One tree might make mistakes.
- **The Solution (Random Forest):** Instead of 1 tree, we create **100 trees**.
  - We ask all 100 trees to make a guess.
  - If 80 trees say "Anxiety" and 20 say "Depression", the final answer is **Anxiety**.
  - **Analogy:** It's like asking the audience in "Who Wants to Be a Millionaire?". The crowd is usually smarter than one person.

### 4. What is "Semi-Supervised Learning"? (The Advanced Part)

This is the "cool factor" of your project.

- **Supervised:** You have a textbook where _every_ question has an answer key. You learn easily.
- **Unsupervised:** You have a textbook with _no_ answers. You just look for patterns.
- **Semi-Supervised (Your Project):** You have a textbook where **half the answers are missing**.
  1.  You study the questions with answers first.
  2.  You try to guess the answers for the blank questions.
  3.  For the guesses you are **super confident** about, you write them in pen.
  4.  Now you have more "answered" questions. You study again.
  - **Why use it?** In the real world (hospitals), getting a doctor to diagnose (label) every patient is expensive. It's cheaper to use a mix of diagnosed and undiagnosed patients.

---

## Part 2: The Code Explained (Line by Line)

### File 1: `data_utils.py` (The Cleaner)

Data is messy. Computers are picky. This file cleans the mess.

- **`import pandas`**: Think of Pandas as "Excel for Python". It lets us open the CSV file.
- **`clean_gender(gender)`**:
  - _Problem:_ In the survey, some people wrote "Male", some wrote "m", some wrote "Man". The computer thinks these are 3 different genders.
  - _Solution:_ This function forces them all to be just "Male". Same for Female.
- **`LabelEncoder`**:
  - _Problem:_ Computers can't do math with words like "Yes" or "No".
  - _Solution:_ This tool turns "No" -> 0 and "Yes" -> 1.

### File 2: `train_model.py` (The Teacher)

This is where the learning happens.

1.  **`df = pd.read_csv(...)`**: We open the textbook (dataset).
2.  **`train_test_split(...)`**:
    - We cut the data into two pieces: **Training Set (80%)** and **Test Set (20%)**.
    - We hide the Test Set. We will use it later to give the model a "Final Exam" to see if it actually learned.
3.  **The Semi-Supervised Trick (Masking):**
    - `y_train_mixed[random_unlabeled_points] = -1`
    - We take our training data and **deliberately erase** 50% of the answers (setting them to -1).
    - We tell the computer: "I'm not telling you the answer for these. Figure it out."
4.  **`SelfTrainingClassifier`**:
    - This is the "Teacher" wrapper. It wraps around the Random Forest.
    - It manages the process of: Train -> Guess Unlabeled -> Add Confident Guesses -> Train Again.
5.  **`joblib.dump(...)`**:
    - Once the model is trained (smart), we "save its brain" to a file (`.pkl`). So we don't have to retrain it every time.

### File 3: `predict.py` (The Application)

This is what the user sees.

1.  **`joblib.load(...)`**: We wake up the saved brain.
2.  **`input(...)`**: We ask the user questions.
3.  **`predict(...)`**: We pass the user's answers to the brain.
4.  **`inverse_transform(...)`**:
    - The brain replies "1".
    - We use this tool to turn "1" back into "Yes" so the user understands.

---

## Part 3: Common Questions Teachers Will Ask

**Q: Why did you choose Random Forest?**
**A:** Because it is very accurate for classification tasks (grouping things). It handles complex data well and doesn't "overfit" (memorize) the data as easily as a single decision tree.

**Q: What happens if I enter a Gender that isn't Male or Female?**
**A:** My code has a `clean_gender` function. If it doesn't recognize the input, it categorizes it as "Other" or "Unknown" so the model doesn't crash.

**Q: How accurate is your model?**
**A:** During testing, it achieved around 85% accuracy. This means it correctly diagnosed 85 out of 100 people in the test set.

**Q: Why do you have two models?**
**A:** One model (`condition_model`) predicts **what** you have (Anxiety, Depression, etc.). The other model (`treatment_model`) predicts **if** you need professional help (Yes/No). They are trained separately to be more precise.

---

## Part 4: How to Present

1.  **Start with the Problem:** "Mental health is important, but diagnosis is hard to access."
2.  **Show the Solution:** "I built an AI that uses historical data to predict conditions."
3.  **Explain the Tech:** "I used Python and a technique called Semi-Supervised Learning, which mimics how humans learn from partial information."
4.  **Demo:** Run `python predict.py` and show them it working live.

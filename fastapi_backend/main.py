from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, conint, confloat
from typing import Literal
import joblib
import pandas as pd
import os
import math

app = FastAPI(title="DILI Risk Inference API", version="1.0.0")

# ================================
# CORS
# ================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================
# MODEL LOADING
# ================================

# Safe handling of __file__ for cloud platforms
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) \
    if "__file__" in globals() else os.getcwd()

MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
_model = None


def load_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")
        _model = joblib.load(MODEL_PATH)
    return _model


# ================================
# REQUEST BODY
# ================================
class PredictionInput(BaseModel):
    Age: conint(ge=0, le=120)
    Sex: Literal[0, 1]
    BMI: confloat(ge=10, le=80)
    Alcohol_Use: Literal[0, 1]
    Preexisting_Liver_Disease: Literal[0, 1]
    ALT: confloat(ge=0)
    AST: confloat(ge=0)
    ALP: confloat(ge=0)
    Bilirubin: confloat(ge=0)
    Albumin: confloat(ge=0)
    Drug_Risk_Score: conint(ge=0, le=10)
    Daily_Dose_mg: conint(ge=0)
    Drug_Duration_Days: conint(ge=0)

    def to_dataframe(self) -> pd.DataFrame:
        ordered_cols = [
            "Age", "Sex", "BMI", "Alcohol_Use", "Preexisting_Liver_Disease",
            "ALT", "AST", "ALP", "Bilirubin", "Albumin",
            "Drug_Risk_Score", "Daily_Dose_mg", "Drug_Duration_Days"
        ]
        data_dict = {col: getattr(self, col) for col in ordered_cols}
        return pd.DataFrame([data_dict], columns=ordered_cols)


# ================================
# RESPONSE BODY
# ================================
class PredictionOutput(BaseModel):
    predicted_class: Literal[0, 1]
    label: str
    probability_dili: float


# ================================
# STARTUP EVENT
# ================================
@app.on_event("startup")
def startup_event():
    load_model()


# ================================
# HEALTH CHECK
# ================================
@app.get("/health")
def health():
    return {"status": "ok"}


# ================================
# PREDICTION ROUTE
# ================================
@app.post("/predict", response_model=PredictionOutput)
def predict(payload: PredictionInput):
    try:
        model = load_model()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    try:
        df = payload.to_dataframe()
        pred = int(model.predict(df)[0])

        # probability
        if hasattr(model, "predict_proba"):
            proba = float(model.predict_proba(df)[0][1])
        elif hasattr(model, "decision_function"):
            score = float(model.decision_function(df)[0])
            proba = 1 / (1 + math.exp(-score))  # sigmoid
        else:
            proba = float(pred)

        return PredictionOutput(
            predicted_class=pred,
            label="DILI (Toxic)" if pred == 1 else "No DILI (Safe)",
            probability_dili=round(proba, 6)
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {e}")


# ================================
# SAMPLE TEST ROUTE
# ================================
@app.get("/predict/example", response_model=PredictionOutput)
def predict_example():
    sample_input = PredictionInput(
        Age=45,
        Sex=1,
        BMI=27.5,
        Alcohol_Use=1,
        Preexisting_Liver_Disease=0,
        ALT=55.3,
        AST=42.7,
        ALP=110.2,
        Bilirubin=1.12,
        Albumin=4.4,
        Drug_Risk_Score=8,
        Daily_Dose_mg=750,
        Drug_Duration_Days=45
    )
    return predict(sample_input)

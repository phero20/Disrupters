import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        // Form Data
        age: { type: Number, required: true },
        sex: { type: String, enum: ["Male", "Female"], required: true },
        bmi: { type: Number, required: true },
        alt: { type: Number, required: true },
        ast: { type: Number, required: true },
        alp: { type: Number, required: true },
        bilirubin: { type: Number, required: true },
        albumin: { type: Number, required: true },
        drug_risk_score: { type: Number, required: true },
        alcohol_use: { type: String, enum: ["Yes", "No"], required: true },
        medications: [{ type: String }],
        symptoms: [{ type: String }],
        preexisting_liver_disease: { type: String, enum: ["Yes", "No"] },
        dili: { type: String, enum: ["Yes", "No"] },
        daily_dose_mg: { type: Number },
        drug_duration_days: { type: Number },

        // Model Response
        predicted_class: { type: Number, required: true },
        label: { type: String, required: true },
        confidence: { type: Number, required: true },
        probability_dili: { type: Number },
        raw_prediction: { type: Number },
        is_disease: { type: Boolean, required: true },

        // Feedback
        feedback: { type: String, enum: ["yes", "no"], default: null },
    },
    { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;

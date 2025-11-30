import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PredictionInputForm from "../components/PredictionInputForm";
import { Stethoscope, Activity, AlertTriangle, CheckCircle, X, ThumbsUp, ThumbsDown } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Diagnostics = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const { saveFeedback, versions } = useAuth();
  const [lastFormData, setLastFormData] = useState(null); // Store form data for feedback

  // OCR state management
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // OCR API URL - can be configured via environment variable
  const OCR_API_URL = import.meta.env.VITE_OCR_API_URL || 'https://netherward-nonpredatorily-jeanna.ngrok-free.dev/extract';

  const handleFeedback = async (type) => {
    setFeedback(type);

    if (!prediction || !lastFormData) return;

    // Map capitalized keys to lowercase for Mongoose model
    const mappedFormData = {
      age: Number(lastFormData.Age),
      sex: lastFormData.Sex,
      bmi: Number(lastFormData.BMI),
      alt: Number(lastFormData.ALT),
      ast: Number(lastFormData.AST),
      alp: Number(lastFormData.ALP),
      bilirubin: Number(lastFormData.Bilirubin),
      albumin: Number(lastFormData.Albumin),
      drug_risk_score: Number(lastFormData.Drug_Risk_Score),
      alcohol_use: lastFormData.Alcohol_Use,
      medications: lastFormData.Medications,
      symptoms: lastFormData.Symptoms,
      preexisting_liver_disease: lastFormData.Preexisting_Liver_Disease,
      dili: lastFormData.DILI,
      daily_dose_mg: Number(lastFormData.Daily_Dose_mg),
      drug_duration_days: Number(lastFormData.Drug_Duration_Days),
    };

    const feedbackData = {
      ...mappedFormData,
      ...prediction,
      feedback: type
    };

    console.log("Sending feedback data:", feedbackData);

    await saveFeedback(feedbackData);
  };

  const handleOCRUpload = async (file) => {
    setOcrLoading(true);
    setOcrError(null);
    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(OCR_API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          const errorText = await response.text();
          errorData = { detail: errorText || `OCR Error: ${response.status}` };
        }
        throw new Error(errorData.detail || `OCR Error: ${response.status}`);
      }

      const extractedData = await response.json();
      console.log('OCR Extracted Data:', extractedData);

      return extractedData;
    } catch (error) {
      console.error('OCR extraction failed:', error);
      setOcrError(error.message || 'Failed to extract data from report');
      throw error;
    } finally {
      setOcrLoading(false);
    }
  };

  const handlePredict = async (formData) => {
    console.log("Raw Form Data:", formData);
    setPrediction(null);
    setFeedback(null);
    setLoading(true);
    setLastFormData(formData); // Save for feedback

    try {
      // Send only the fields needed by the model (matching the curl request format)
      // Note: BMI, Drug_Risk_Score, Alcohol_Use, Medications, Symptoms are kept in form 
      // for UI purposes but are not sent to the model as they're not used in prediction
      const payload = {
        Age: Number(formData.Age) || 0,
        Sex: formData.Sex || "Male",
        ALT: Number(formData.ALT) || 0,
        AST: Number(formData.AST) || 0,
        ALP: Number(formData.ALP) || 0,
        Bilirubin: Number(formData.Bilirubin) || 0,
        Albumin: Number(formData.Albumin) || 0,
      };

      console.log("Sending payload to backend (only model-relevant fields):", payload);

      const response = await fetch("https://5a1845ab7079.ngrok-free.app/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          const errorText = await response.text();
          errorData = { detail: errorText || `API Error: ${response.status}` };
        }
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Prediction result:", result);

      // Transform backend response to match frontend expectations
      // Model classes: 1 = Liver Disease, 2 = No Disease (or 0 = No Disease, 1 = Liver Disease)
      const isDisease = result.prediction === 1;
      const transformedResult = {
        predicted_class: result.prediction,
        label: isDisease ? "High Risk of Hepatotoxicity" : "Low Risk of Hepatotoxicity",
        probability_dili: result.confidence || 0,
        confidence: result.confidence || 0,
        raw_prediction: result.prediction,
        is_disease: isDisease
      };

      setPrediction(transformedResult);

      // Scroll to result
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error("Prediction failed:", error);
      alert(`Error: ${error.message}\n\nPlease ensure:\n1. The server is running onhttps://5a1845ab7079.ngrok-free.app All required fields are filled\n3. Feature values are valid numbers`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background p-5"
    >
      <div className="max-w-7xl mx-auto space-y-8 relative">

        {/* Result Overlay / Panel */}
        <AnimatePresence>
          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setPrediction(null)}
            >
              <motion.div
                className="bg-card border border-border shadow-2xl rounded-3xl w-full max-w-lg overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPrediction(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

                <div className={`p-8 text-center ${prediction.is_disease
                  ? "bg-red-500/10"
                  : "bg-green-500/10"
                  }`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 
                      ${prediction.is_disease
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                      }`}
                  >
                    {prediction.is_disease ? (
                      <AlertTriangle size={40} />
                    ) : (
                      <CheckCircle size={40} />
                    )}
                  </motion.div>

                  <h2 className={`text-3xl font-bold mb-2 ${prediction.is_disease
                    ? "text-red-600"
                    : "text-green-600"
                    }`}>
                    {prediction.label}
                  </h2>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2 font-medium text-muted-foreground">
                      <span>Confidence Score</span>
                      <span>{(prediction.probability_dili * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.probability_dili * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${prediction.is_disease ? "bg-red-500" : "bg-green-500"}`}
                      />
                    </div>
                  </div>

                  {/* Feedback Section */}
                  {!feedback ? (
                    <div className="pt-6 border-t border-border">
                      <p className="text-center text-sm font-medium text-muted-foreground mb-4">
                        Do you agree with this assessment?
                      </p>
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleFeedback('yes')}
                          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors font-medium"
                        >
                          <ThumbsUp size={18} />
                          Agree
                        </button>
                        <button
                          onClick={() => handleFeedback('no')}
                          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors font-medium"
                        >
                          <ThumbsDown size={18} />
                          Disagree
                        </button>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-6 border-t border-border text-center"
                    >
                      <p className="text-sm font-medium text-primary flex items-center justify-center gap-2">
                        <CheckCircle size={16} />
                        Thank you for your feedback!
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Stethoscope className="text-primary" />
              AI Diagnostics
            </h1>
            <p className="text-muted-foreground mt-1">
              Advanced DILI Risk Assessment Model (v{versions.length > 0 ? versions[0].version : "1.0"})
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium">
            <Activity size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Analyzing..." : "System Ready"}
          </div>
        </div>

        <div className="grid lg:grid-cols-1 gap-8">
          <PredictionInputForm
            onSubmit={handlePredict}
            onOCRUpload={handleOCRUpload}
            ocrLoading={ocrLoading}
            ocrError={ocrError}
            uploadedFile={uploadedFile}
            onRemoveUploadedFile={() => {
              setUploadedFile(null);
              setOcrError(null);
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Diagnostics;
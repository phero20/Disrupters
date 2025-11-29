import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PredictionInputForm from "../components/PredictionInputForm"
import { Stethoscope, Activity, AlertTriangle, CheckCircle, X } from "lucide-react";

const Diagnostics = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Map form data to 10 features expected by the model
  const mapFormDataToFeatures = (data) => {
    // Feature mapping based on medical relevance:
    // 1. Age
    // 2. Sex (Male=1, Female=0)
    // 3. BMI
    // 4. ALT (liver enzyme)
    // 5. AST (liver enzyme)
    // 6. ALP (liver enzyme)
    // 7. Bilirubin
    // 8. Albumin
    // 9. Drug_Risk_Score
    // 10. Alcohol_Use (Yes=1, No=0)
    
    return [
      Number(data.Age) || 0,
      data.Sex === "Male" ? 1 : 0,
      Number(data.BMI) || 0,
      Number(data.ALT) || 0,
      Number(data.AST) || 0,
      Number(data.ALP) || 0,
      Number(data.Bilirubin) || 0,
      Number(data.Albumin) || 0,
      Number(data.Drug_Risk_Score) || 0,
      data.Alcohol_Use === "Yes" ? 1 : 0,
    ];
  };

  const handlePredict = async (formData) => {
    console.log("Raw Form Data:", formData);
    setPrediction(null);
    setLoading(true);

    try {
      // Transform form data to features array
      const features = mapFormDataToFeatures(formData);
      
      console.log("Features array:", features);

      const response = await fetch("https://5a1845ab7079.ngrok-free.app/predict", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          features: features
        }),
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
      const transformedResult = {
        predicted_class: result.prediction,
        label: result.prediction === 1 ? "High Risk" : result.prediction === 2 ? "Low Risk" : "Unknown",
        probability_dili: result.confidence || 0,
        confidence: result.confidence || 0,
        raw_prediction: result.prediction
      };

      setPrediction(transformedResult);

      // Scroll to result
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error("Prediction failed:", error);
      alert(`Error: ${error.message}\n\nPlease ensure:\n1. The server is running on http://localhost:8000\n2. All required fields are filled\n3. Feature values are valid numbers`);
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

                <div className={`p-8 text-center ${
                  prediction.predicted_class === 1 
                    ? "bg-red-500/10" 
                    : prediction.predicted_class === 2 
                    ? "bg-green-500/10" 
                    : "bg-yellow-500/10"
                }`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 
                      ${
                        prediction.predicted_class === 1 
                          ? "bg-red-500 text-white" 
                          : prediction.predicted_class === 2 
                          ? "bg-green-500 text-white" 
                          : "bg-yellow-500 text-white"
                      }`}
                  >
                    {prediction.predicted_class === 1 ? (
                      <AlertTriangle size={40} />
                    ) : prediction.predicted_class === 2 ? (
                      <CheckCircle size={40} />
                    ) : (
                      <Activity size={40} />
                    )}
                  </motion.div>

                  <h2 className={`text-3xl font-bold mb-2 ${
                    prediction.predicted_class === 1 
                      ? "text-red-600" 
                      : prediction.predicted_class === 2 
                      ? "text-green-600" 
                      : "text-yellow-600"
                  }`}>
                    {prediction.label}
                  </h2>
                  <p className="text-muted-foreground">
                    Based on the provided clinical data
                  </p>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span>Confidence Score</span>
                      <span>{(prediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-4 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          prediction.predicted_class === 1 
                            ? "bg-red-500" 
                            : prediction.predicted_class === 2 
                            ? "bg-green-500" 
                            : "bg-yellow-500"
                        }`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {prediction.predicted_class === 1
                        ? "High risk classification with strong model confidence."
                        : prediction.predicted_class === 2
                        ? "Low risk classification with strong model confidence."
                        : "Classification result with moderate confidence."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <span className="block text-muted-foreground text-xs uppercase tracking-wider">Prediction</span>
                      <span className="font-semibold text-lg">Class {prediction.predicted_class}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <span className="block text-muted-foreground text-xs uppercase tracking-wider">Model Version</span>
                      <span className="font-semibold text-lg">v1.0.0</span>
                    </div>
                  </div>

                  {prediction.raw_prediction && (
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground text-center">
                        Raw prediction value: {prediction.raw_prediction}
                      </p>
                    </div>
                  )}
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <div className="text-center space-y-4 mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center p-2 rounded-2xl bg-primary/10 text-primary mb-1"
          >
            <Stethoscope size={32} />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Health Diagnostics
          </h1>
          <p className="text-muted-foreground text-md max-w-3xl mx-auto leading-relaxed">
            Leverage our advanced machine learning model to analyze patient vitals and predict potential health risks with high accuracy.
          </p>
        </div>

        <div className="grid lg:grid-cols-1 gap-8">
          <PredictionInputForm onSubmit={handlePredict} />
        </div>
      </div>
    </motion.div>
  );
};

export default Diagnostics;


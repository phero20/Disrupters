import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PredictionInputForm from "../components/PredictionInputForm";
import { Stethoscope, Activity, AlertTriangle, CheckCircle, X } from "lucide-react";

const Diagnostics = () => {
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async (data) => {
    console.log("Raw Form Data:", data);
    setPrediction(null); // Reset previous result

    try {
      // Transform data to match backend expectation
      const payload = {
        Age: Number(data.Age),
        Sex: data.Sex === "Male" ? 1 : 0,
        BMI: Number(data.BMI),
        Alcohol_Use: data.Alcohol_Use === "Yes" ? 1 : 0,
        Preexisting_Liver_Disease: data.Preexisting_Liver_Disease === "Yes" ? 1 : 0,
        ALT: Number(data.ALT),
        AST: Number(data.AST),
        ALP: Number(data.ALP),
        Bilirubin: Number(data.Bilirubin),
        Albumin: Number(data.Albumin),
        Drug_Risk_Score: Number(data.Drug_Risk_Score),
        Daily_Dose_mg: Number(data.Daily_Dose_mg),
        Drug_Duration_Days: Number(data.Drug_Duration_Days),
      };

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      setPrediction(result);

      // Scroll to result
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Prediction failed:", error);
      alert(`Error: ${error.message}`);
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
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={20} />
                </button>

                <div className={`p-8 text-center ${prediction.predicted_class === 1 ? "bg-red-500/10" : "bg-green-500/10"}`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 
                      ${prediction.predicted_class === 1 ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                  >
                    {prediction.predicted_class === 1 ? <AlertTriangle size={40} /> : <CheckCircle size={40} />}
                  </motion.div>

                  <h2 className={`text-3xl font-bold mb-2 ${prediction.predicted_class === 1 ? "text-red-600" : "text-green-600"}`}>
                    {prediction.label}
                  </h2>
                  <p className="text-muted-foreground">
                    Based on the provided clinical data
                  </p>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span>Risk Probability</span>
                      <span>{(prediction.probability_dili * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-4 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.probability_dili * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${prediction.predicted_class === 1 ? "bg-red-500" : "bg-green-500"}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {prediction.probability_dili > 0.5
                        ? "High probability of Drug-Induced Liver Injury."
                        : "Low probability of Drug-Induced Liver Injury."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <span className="block text-muted-foreground text-xs uppercase tracking-wider">Confidence</span>
                      <span className="font-semibold text-lg">High</span>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <span className="block text-muted-foreground text-xs uppercase tracking-wider">Model Version</span>
                      <span className="font-semibold text-lg">v1.0.0</span>
                    </div>
                  </div>
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
          <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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

import React from "react";
import { motion } from "framer-motion";
import PredictionInputForm from "../components/PredictionInputForm";
import { Stethoscope } from "lucide-react";

const Diagnostics = () => {
  const handlePredict = async (data) => {
    console.log("Predict:", data);

    // You can later replace this with a real API call:
    // const result = await api.predict(data);

    return new Promise((res) => setTimeout(res, 1000)); // fake delay
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8"
    >
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Stethoscope size={24} />
        </div>
        <h1 className="text-2xl font-bold">AI Diagnostics</h1>
      </div>

      <p className="text-muted-foreground max-w-2xl">
        Enter the patient's vitals below to generate an AI-powered prediction
        based on our medical model.
      </p>

      <PredictionInputForm
        fields={["Age", "Blood Pressure", "Heart Rate", "Respiration Rate", "SPO₂"]}
        onSubmit={handlePredict}
      />
    </motion.div>
  );
};

export default Diagnostics;

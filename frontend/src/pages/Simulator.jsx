import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Activity, RefreshCw, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { debounce } from "lodash";

const Simulator = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  // Initial State (Average Healthy Male)
  const [formData, setFormData] = useState({
    Age: 45,
    Sex: 1, // 1=Male, 0=Female
    BMI: 24.5,
    Alcohol_Use: 0, // 0=No, 1=Yes
    Preexisting_Liver_Disease: 0,
    ALT: 25,
    AST: 22,
    ALP: 70,
    Bilirubin: 0.8,
    Albumin: 4.2,
    Drug_Risk_Score: 2,
    Daily_Dose_mg: 100,
    Drug_Duration_Days: 10
  });

  const [error, setError] = useState(null);

  // Debounced Prediction Function
  const fetchPrediction = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Construct payload matching the API expectation
      const payload = {
        Age: Number(data.Age),
        Sex: data.Sex === 1 ? "Male" : "Female",
        BMI: Number(data.BMI),
        Alcohol_Use: data.Alcohol_Use === 1 ? "Yes" : "No",
        Preexisting_Liver_Disease: data.Preexisting_Liver_Disease === 1 ? "Yes" : "No",
        ALT: Number(data.ALT),
        AST: Number(data.AST),
        ALP: Number(data.ALP),
        Bilirubin: Number(data.Bilirubin),
        Albumin: Number(data.Albumin),
        Drug_Risk_Score: Number(data.Drug_Risk_Score),
        Daily_Dose_mg: Number(data.Daily_Dose_mg),
        Drug_Duration_Days: Number(data.Drug_Duration_Days)
      };

      const response = await fetch("https://5a1845ab7079.ngrok-free.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("AI Prediction Result:", result); // Debug log

      // Handle various possible response formats
      const prob = result.probability_dili ?? result.confidence ?? result.probability ?? 0;
      const predClass = result.predicted_class ?? result.prediction ?? 0;

      setPrediction({
        probability: prob,
        isDisease: Number(predClass) === 1
      });
    } catch (err) {
      console.error("Simulation failed:", err);
      setError("Failed to connect to AI Model. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce the API call to avoid spamming while sliding
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPredict = useCallback(debounce((data) => fetchPrediction(data), 500), [fetchPrediction]);

  // Effect to trigger prediction on change
  useEffect(() => {
    debouncedPredict(formData);
  }, [formData]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="text-yellow-500 fill-yellow-500" />
            AI Health Simulator
          </h1>
          <p className="text-muted-foreground mt-1">
            Adjust patient parameters in real-time to see how the AI assesses risk.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium">
          <Activity size={16} className={loading ? "animate-spin" : ""} />
          {error ? <span className="text-red-500">{error}</span> : (loading ? "Simulating..." : "Live Model Connected")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CONTROLS PANEL */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1: Demographics & Lifestyle */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Patient Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SliderControl label="Age" value={formData.Age} min={18} max={90} unit="yrs" onChange={(v) => handleChange("Age", v)} />
              <SliderControl label="BMI" value={formData.BMI} min={15} max={45} step={0.1} unit="" onChange={(v) => handleChange("BMI", v)} />

              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                <span className="text-sm font-medium">Sex</span>
                <div className="flex gap-2">
                  <button onClick={() => handleChange("Sex", 1)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${formData.Sex === 1 ? "bg-blue-500 text-white" : "bg-background hover:bg-accent"}`}>Male</button>
                  <button onClick={() => handleChange("Sex", 0)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${formData.Sex === 0 ? "bg-pink-500 text-white" : "bg-background hover:bg-accent"}`}>Female</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                <span className="text-sm font-medium">Alcohol Use</span>
                <button
                  onClick={() => handleChange("Alcohol_Use", formData.Alcohol_Use === 1 ? 0 : 1)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.Alcohol_Use === 1 ? "bg-primary" : "bg-muted"}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.Alcohol_Use === 1 ? "translate-x-6" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Vitals */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Liver Function Tests (LFTs)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SliderControl label="ALT (Alanine Aminotransferase)" value={formData.ALT} min={5} max={150} unit="U/L" onChange={(v) => handleChange("ALT", v)} color="accent" />
              <SliderControl label="AST (Aspartate Aminotransferase)" value={formData.AST} min={5} max={150} unit="U/L" onChange={(v) => handleChange("AST", v)} color="accent" />
              <SliderControl label="ALP (Alkaline Phosphatase)" value={formData.ALP} min={20} max={200} unit="U/L" onChange={(v) => handleChange("ALP", v)} color="accent" />
              <SliderControl label="Bilirubin" value={formData.Bilirubin} min={0.1} max={5.0} step={0.1} unit="mg/dL" onChange={(v) => handleChange("Bilirubin", v)} color="accent" />
            </div>
          </div>

          {/* Section 3: Medication */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Medication Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SliderControl label="Drug Risk Score" value={formData.Drug_Risk_Score} min={0} max={10} unit="/10" onChange={(v) => handleChange("Drug_Risk_Score", v)} />
              <SliderControl label="Daily Dose" value={formData.Daily_Dose_mg} min={0} max={2000} step={50} unit="mg" onChange={(v) => handleChange("Daily_Dose_mg", v)} />
              <SliderControl label="Duration" value={formData.Drug_Duration_Days} min={1} max={365} unit="days" onChange={(v) => handleChange("Drug_Duration_Days", v)} />
            </div>
          </div>

        </div>

        {/* RESULTS PANEL (STICKY) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">

            <motion.div
              layout
              className={`p-8 rounded-3xl border-2 shadow-xl transition-all duration-500 ${prediction?.isDisease
                ? "bg-red-500/5 border-red-500/20"
                : "bg-green-500/5 border-green-500/20"
                }`}
            >
              <h2 className="text-center text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                Real-Time Risk Assessment
              </h2>

              {/* LOADING OVERLAY */}
              {loading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-3xl">
                  <Activity className="animate-spin text-primary mb-2" size={32} />
                  <span className="text-xs font-medium text-muted-foreground animate-pulse">Analyzing...</span>
                </div>
              )}

              {/* GAUGE */}
              <div className="relative w-48 mx-auto mb-16">
                <div className="relative w-48 h-24 overflow-hidden">
                  <div className="absolute bottom-0 w-full h-full bg-secondary rounded-t-full"></div>
                  <motion.div
                    className="absolute bottom-0 w-full h-full rounded-t-full origin-bottom transition-all duration-500"
                    style={{
                      background: `conic-gradient(from 180deg at 50% 100%, ${prediction?.isDisease ? '#ef4444' : '#22c55e'} 0deg, transparent 180deg)`,
                      transform: `rotate(${(prediction?.probability || 0) * 180 - 180}deg)`
                    }}
                  />
                </div>
                {/* Inner Circle (Moved outside overflow-hidden) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-32 h-32 bg-card rounded-full flex items-center justify-center border-4 border-background shadow-inner">
                  <span className="text-3xl font-bold">
                    {prediction ? (prediction.probability * 100).toFixed(0) : "--"}%
                  </span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${prediction?.isDisease ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  }`}>
                  {prediction?.isDisease ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                  {prediction?.isDisease ? "HIGH RISK" : "SAFE"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Probability of Drug-Induced Liver Injury
                </p>
              </div>
            </motion.div>

            {/* INSIGHTS */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <RefreshCw size={16} className="text-primary" />
                Live Insights
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                  <span>Increasing <strong>Age</strong> above 60 significantly raises risk sensitivity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                  <span><strong>Alcohol Use</strong> acts as a multiplier for liver toxicity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                  <span>Elevated <strong>ALT/AST</strong> are the strongest indicators of current damage.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Component for Sliders
const SliderControl = ({ label, value, min, max, step = 1, unit, onChange, color = "primary" }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="font-bold tabular-nums">{value} <span className="text-xs font-normal text-muted-foreground">{unit}</span></span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-${color}`}
    />
  </div>
);

export default Simulator;

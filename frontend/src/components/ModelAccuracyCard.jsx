import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

// ---- Circular Progress Component ----
const CircleProgress = ({ value, color }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - value) / 100) * circumference;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="w-28 h-28 rotate-[-90deg]">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          className="transition-all duration-700"
        />
      </svg>

      <p className="absolute text-xl font-semibold text-foreground">
        {value}%
      </p>
    </div>
  );
};

// ---- Metric Card ----
const Metric = ({ label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center text-center p-3"
  >
    <CircleProgress value={value} color={color} />
    <p className="mt-3 text-sm text-muted-foreground">{label}</p>
  </motion.div>
);

// ---- Main Component ----
const ModelAccuracyCard = ({ accuracy, precision, recall, f1 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="p-6 border border-border rounded-2xl bg-card shadow-lg hover:shadow-xl transition-all"
  >
    {/* Header */}
    <div className="flex items-center gap-2 mb-6">
      <BarChart3 className="text-primary" />
      <h2 className="font-semibold text-lg">Model Performance</h2>
    </div>

    {/* Metrics */}
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 place-items-center">
      <Metric label="Accuracy" value={accuracy} color="#6366F1" />
      <Metric label="Precision" value={precision} color="#10B981" />
      <Metric label="Recall" value={recall} color="#F59E0B" />
      <Metric label="F1 Score" value={f1} color="#EF4444" />
    </div>
  </motion.div>
);

export default ModelAccuracyCard;

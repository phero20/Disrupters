import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Cpu } from "lucide-react";

const PredictionInputForm = ({ fields = [], onSubmit }) => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    fields.forEach((f) => {
      if (!form[f] || form[f].trim() === "") newErrors[f] = "Required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 p-6 border border-border rounded-2xl bg-card shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="text-primary" />
        <h2 className="font-semibold text-lg">Model Input Features</h2>
      </div>

      {/* Input Fields */}
      {fields.map((f, idx) => (
        <motion.div
          key={f}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="flex flex-col gap-1"
        >
          <label className="text-sm text-muted-foreground">{f}</label>

          <input
            type="number"
            placeholder="Enter value..."
            onChange={(e) =>
              setForm({ ...form, [f]: e.target.value })
            }
            className={`px-4 py-3 rounded-xl border bg-background outline-none transition-all 
              ${
                errors[f]
                  ? "border-red-500 focus:border-red-500"
                  : "border-border focus:border-primary"
              }
            `}
          />

          {errors[f] && (
            <p className="text-xs text-red-500">{errors[f]}</p>
          )}
        </motion.div>
      ))}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.96 }}
        disabled={loading}
        className={`w-full py-3 rounded-xl text-primary-foreground font-semibold flex items-center justify-center gap-2
          ${
            loading
              ? "bg-primary/60 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 shadow-md"
          }
        `}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            Predict <ArrowRight size={18} />
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default PredictionInputForm;

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Beaker,
  ChevronRight,
  Cpu,
  HeartPulse,
  Pill,
  User
} from "lucide-react";

const MEDICATIONS = [
  "Paracetamol", "Ibuprofen", "Amoxicillin",
  "Diclofenac", "Metformin", "Atorvastatin", "Naproxen"
];

const SYMPTOMS = [
  "Fatigue", "Nausea", "Vomiting", "Abdominal Pain",
  "Jaundice", "Dark Urine", "Loss of Appetite",
  "Itching", "Fever", "Swelling"
];

const SECTIONS = [
  {
    id: "patient",
    title: "Patient Details",
    icon: User,
    fields: ["Age", "Sex", "BMI"]
  },
  {
    id: "lifestyle",
    title: "Lifestyle & History",
    icon: Activity,
    fields: ["Alcohol_Use", "Preexisting_Liver_Disease", "DILI"]
  },
  {
    id: "drug_info",
    title: "Drug Information",
    icon: Pill,
    fields: ["Drug_Risk_Score", "Daily_Dose_mg", "Drug_Duration_Days"]
  },
  {
    id: "lab_results",
    title: "Lab Results",
    icon: Beaker,
    fields: ["ALT", "AST", "ALP", "Bilirubin", "Albumin"]
  }
];


// ----------------------------------------------------
// UPDATED INPUT FIELD — With Slim, Clean, Visible Border
// ----------------------------------------------------
const InputField = ({ label, value, onChange, error, type = "text", options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {label.replace(/_/g, " ")}
    </label>

    {options ? (
      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-2.5 rounded-xl text-sm
            bg-background/60 border
            border-primary/40
            transition-all duration-200 appearance-none
            ${error
              ? "border-destructive focus:border-destructive focus:ring-destructive/30"
              : "border-border/60 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            }
          `}
        >
          <option value="">Select...</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <ChevronRight size={16} className="rotate-90" />
        </div>
      </div>
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-2.5 rounded-xl text-sm
          bg-background/60 border
          border-primary/40
          transition-all duration-200
          ${error
            ? "border-destructive focus:border-destructive focus:ring-destructive/30"
            : "border-border/60 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
          }
        `}
      />
    )}

    {error && (
      <span className="text-[10px] text-destructive font-medium flex items-center gap-1">
        <AlertCircle size={10} /> {error}
      </span>
    )}
  </div>
);



export default function PredictionInputForm({ onSubmit }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "Age", "BMI", "Sex", "Alcohol_Use",
      "Preexisting_Liver_Disease", "ALT", "AST",
      "ALP", "Bilirubin", "Albumin",
      "Drug_Risk_Score", "Daily_Dose_mg",
      "Drug_Duration_Days", "DILI"
    ];

    requiredFields.forEach((f) => {
      if (!form[f]) newErrors[f] = "Required";
    });

    if (!form?.Medications?.length)
      newErrors.Medications = "Select at least one medication";

    if (!form?.Symptoms?.length)
      newErrors.Symptoms = "Select at least one symptom";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleSelect = (key, value) => {
    let arr = form[key] || [];
    arr = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
    setForm({ ...form, [key]: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  const getFieldType = (key) => {
    if (["Age", "BMI", "ALT", "AST", "ALP", "Bilirubin", "Albumin", "Drug_Risk_Score", "Daily_Dose_mg", "Drug_Duration_Days"].includes(key))
      return "number";
    return "text";
  };

  const getOptions = (key) => {
    if (key === "Sex") return ["Male", "Female"];
    if (["Alcohol_Use", "Preexisting_Liver_Disease", "DILI"].includes(key))
      return ["Yes", "No"];
    return null;
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-360 mx-auto space-y-8"
    >
      {/* SECTIONS */}
      <div className="grid md:grid-cols-2 gap-6">
        {SECTIONS.map((section, idx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md duration-300"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <section.icon size={20} />
              </div>
              <h3 className="font-semibold text-lg">{section.title}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((key) => (
                <div key={key} className={["Drug_Risk_Score", "Daily_Dose_mg", "Drug_Duration_Days"].includes(key) ? "sm:col-span-2" : ""}>
                  <InputField
                    label={key}
                    value={form[key]}
                    onChange={(val) => setForm({ ...form, [key]: val })}
                    error={errors[key]}
                    type={getFieldType(key)}
                    options={getOptions(key)}
                    className='border-primary/40'
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>


      {/* MULTI SELECT SECTIONS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Medications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Pill size={18} />
            </div>
            <label className="font-semibold">Medications</label>
          </div>

          <div className="flex flex-wrap gap-2">
            {MEDICATIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleSelect("Medications", m)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-full border duration-200 cursor-pointer
                  ${form?.Medications?.includes(m)
                    ? "bg-blue-500 text-white border-blue-500 shadow-blue-500/20"
                    : "bg-secondary/30 border-border/40 hover:border-blue-500/40 text-muted-foreground"
                  }
                `}
              >
                {m}
              </button>
            ))}
          </div>

          {errors.Medications && (
            <p className="mt-2 text-xs text-destructive font-medium flex items-center gap-1">
              <AlertCircle size={12} /> {errors.Medications}
            </p>
          )}
        </motion.div>


        {/* Symptoms */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <HeartPulse size={18} />
            </div>
            <label className="font-semibold">Symptoms</label>
          </div>

          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSelect("Symptoms", s)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-full border duration-200 cursor-pointer
                  ${form?.Symptoms?.includes(s)
                    ? "bg-rose-500 text-white border-rose-500 shadow-rose-500/20"
                    : "bg-secondary/30 border-border/40 hover:border-rose-500/40 text-muted-foreground"
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>

          {errors.Symptoms && (
            <p className="mt-2 text-xs text-destructive font-medium flex items-center gap-1">
              <AlertCircle size={12} /> {errors.Symptoms}
            </p>
          )}
        </motion.div>
      </div>




      {/* SUBMIT BUTTON */}
      <div className="flex justify-center pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className={`
            relative overflow-hidden cursor-pointer group px-8 py-4 rounded-2xl font-bold text-lg shadow-xl duration-300
            ${loading
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-white hover:shadow-primary/25 hover:ring-2 hover:ring-primary/20"
            }
          `}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 duration-300" />
          <div className="relative flex items-center gap-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Analysis...</span>
              </>
            ) : (
              <>
                <Cpu size={20} />
                <span>Generate Prediction</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 duration-200" />
              </>
            )}
          </div>
        </motion.button>
      </div>
    </motion.form>
  );
}

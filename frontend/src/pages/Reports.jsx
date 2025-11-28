import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

const reports = [
  {
    title: "Patient Risk Summary",
    desc: "AI-generated risk stratification for all admitted patients.",
    icon: Activity,
    color: "text-red-500 bg-red-500/10",
    date: "Today",
  },
  {
    title: "Daily Hospital Overview",
    desc: "Admission rate, discharge count, and patient load summary.",
    icon: BarChart3,
    color: "text-blue-600 bg-blue-500/10",
    date: "Today",
  },
  {
    title: "Prediction Accuracy Report",
    desc: "Model performance metrics including precision & recall.",
    icon: PieChart,
    color: "text-green-600 bg-green-500/10",
    date: "Yesterday",
  },
  {
    title: "Vitals Anomaly Report",
    desc: "List of patients flagged due to abnormal vitals.",
    icon: FileText,
    color: "text-orange-600 bg-orange-500/10",
    date: "2 days ago",
  },
];

const Reports = () => {
  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">
          All system-generated reports appear here.
        </p>
      </div>

      {/* REPORT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all"
          >
            {/* ICON */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${r.color}`}
              >
                <r.icon size={26} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{r.title}</h2>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {r.desc}
            </p>

            {/* Actions */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 py-2 px-4 rounded-lg border border-border hover:bg-accent transition-all">
                <Download size={16} />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reports;

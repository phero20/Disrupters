import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Activity,
  User,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";

const Reports = () => {
  const { allFeedbacks, fetchAllFeedbacks } = useAuth();

  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Patient Reports</h1>
          <p className="text-muted-foreground">
            Archive of all AI risk assessments and doctor verifications.
          </p>
        </div>
        <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
          {allFeedbacks.length} Records Found
        </div>
      </div>

      {/* REPORT CARDS GRID */}
      {allFeedbacks.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-medium">No Reports Generated</h3>
          <p className="text-muted-foreground">
            Run a diagnostic scan to generate your first report.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allFeedbacks.map((report, i) => (
            <motion.div
              key={report._id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-card border border-border hover:border-primary/50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* STATUS BADGE */}
              <div className="absolute top-6 right-6">
                {report.is_disease ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 border border-red-500/20">
                    <AlertTriangle size={12} />
                    HIGH RISK
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 border border-green-500/20">
                    <CheckCircle size={12} />
                    LOW RISK
                  </span>
                )}
              </div>

              {/* PATIENT INFO */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg
                  ${report.is_disease ? "bg-gradient-to-br from-red-500 to-orange-500" : "bg-gradient-to-br from-green-500 to-emerald-500"}
                `}>
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Patient {allFeedbacks.length - i}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(report.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* FULL CLINICAL DATA */}
              <div className="space-y-4 mb-6">
                {/* Vitals & Demographics */}
                <div className="bg-secondary/30 rounded-lg p-3">
                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Patient Profile</h4>
                  <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age/Sex:</span>
                      <span className="font-medium">{report.age} / {report.sex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">BMI:</span>
                      <span className="font-medium">{report.bmi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alcohol:</span>
                      <span className="font-medium">{report.alcohol_use}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Score:</span>
                      <span className="font-medium">{report.drug_risk_score}</span>
                    </div>
                  </div>
                </div>

                {/* Liver Panel */}
                <div className="bg-secondary/30 rounded-lg p-3">
                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Liver Panel</h4>
                  <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ALT:</span>
                      <span className="font-medium">{report.alt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AST:</span>
                      <span className="font-medium">{report.ast}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ALP:</span>
                      <span className="font-medium">{report.alp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bilirubin:</span>
                      <span className="font-medium">{report.bilirubin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Albumin:</span>
                      <span className="font-medium">{report.albumin}</span>
                    </div>
                  </div>
                </div>

                {/* History & Meds */}
                <div className="bg-secondary/30 rounded-lg p-3">
                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">History & Meds</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-border/50 pb-1">
                      <span className="text-muted-foreground">Pre-existing Disease:</span>
                      <span className="font-medium">{report.preexisting_liver_disease || "No"}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-1">
                      <span className="text-muted-foreground">Prev. DILI:</span>
                      <span className="font-medium">{report.dili || "No"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Medications:</span>
                      <div className="flex flex-wrap gap-1">
                        {report.medications && report.medications.length > 0 ? (
                          report.medications.map((med, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-background rounded border border-border text-[10px] font-medium">
                              {med}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground italic">None</span>
                        )}
                      </div>
                    </div>
                    {report.daily_dose_mg && (
                      <div className="flex justify-between pt-1">
                        <span className="text-muted-foreground">Dosage:</span>
                        <span className="font-medium">{report.daily_dose_mg}mg ({report.drug_duration_days} days)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AI ANALYSIS */}
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className="font-bold">{(report.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${report.is_disease ? "bg-red-500" : "bg-green-500"}`}
                    style={{ width: `${report.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* FOOTER / ACTIONS */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs font-medium">
                  {report.feedback === 'yes' ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle size={14} /> Verified by Dr.
                    </span>
                  ) : !report.feedback ? (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock size={14} /> Pending Review
                    </span>
                  ) : null}
                </div>

                <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Download Report">
                  <Download size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;

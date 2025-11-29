import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { AlertTriangle, Calendar, User, Activity, FileText } from "lucide-react";
import Loader from "../components/Loader";

const Evaluation = () => {
  const { negativeFeedbacks, feedbackLoading, user, fetchNegativeFeedbacks } = useAuth();

  useEffect(() => {
    fetchNegativeFeedbacks();
  }, []);

  if (feedbackLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Debug Info - Remove later */}
    
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Model Evaluation - Negative Feedback</h1>
          <p className="text-muted-foreground">
            Review cases where the AI prediction did not match the medical report.
          </p>
        </div>
      </div>

      {negativeFeedbacks.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-2xl">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-medium">No Negative Feedback Found</h3>
          <p className="text-muted-foreground">
            There are no recorded instances of incorrect predictions.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Patient Details</th>
                  <th className="px-6 py-4">Clinical Data</th>
                  <th className="px-6 py-4">AI Prediction</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {negativeFeedbacks.map((item) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground pl-6">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium">
                        <User size={14} className="text-primary" />
                        {item.age} yrs, {item.sex}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        BMI: {item.bmi}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <span>ALT: {item.alt}</span>
                        <span>AST: {item.ast}</span>
                        <span>ALP: {item.alp}</span>
                        <span>Bil: {item.bilirubin}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.is_disease
                          ? "bg-red-500/10 text-red-600"
                          : "bg-green-500/10 text-green-600"
                          }`}
                      >
                        {item.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.confidence > 0.8 ? "bg-green-500" : "bg-yellow-500"
                              }`}
                            style={{ width: `${item.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {(item.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-600">
                        <AlertTriangle size={12} />
                        Mismatch (No)
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evaluation;

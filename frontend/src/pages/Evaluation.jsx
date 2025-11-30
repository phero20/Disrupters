import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { AlertTriangle, Calendar, User, Activity, FileText, Brain, Cpu, CheckCircle } from "lucide-react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const Evaluation = () => {
  const { negativeFeedbacks, feedbackLoading, user, fetchNegativeFeedbacks } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNegativeFeedbacks();
  }, []);

  if (feedbackLoading) {
    return <Loader />;
  }

  // Chunk feedbacks into groups of 10
  const chunkSize = 10;
  const feedbackChunks = [];
  for (let i = 0; i < negativeFeedbacks.length; i += chunkSize) {
    feedbackChunks.push(negativeFeedbacks.slice(i, i + chunkSize));
  }

  const handleTrain = () => {
    const nextVersion = Math.floor(negativeFeedbacks.length / 10) + 1;
    navigate("/version-control", { state: { autoTrain: true, version: nextVersion } });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Model Evaluation & Retraining</h1>
          <p className="text-muted-foreground">
            Review feedback batches and retrain the model to improve accuracy.
          </p>
        </div>
      </div>

      {feedbackChunks.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-2xl">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-medium">No Negative Feedback Found</h3>
          <p className="text-muted-foreground">
            There are no recorded instances of incorrect predictions to train on.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {feedbackChunks.map((chunk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    Version {index + 1}.0
                  </span>
                  <span className="text-muted-foreground text-sm font-normal">
                    ({chunk.length} samples)
                  </span>
                </h2>
                {chunk.length === 10 && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle size={16} /> Batch Complete
                  </div>
                )}
              </div>

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
                      {chunk.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-accent/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar size={14} />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 font-medium">
                              <User size={14} className="text-primary" />
                              {item.age} yrs, {item.sex}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                              <span>ALT: {item.alt}</span>
                              <span>AST: {item.ast}</span>
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
                              No
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Training Hub - Compact Version */}
      {negativeFeedbacks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/10 overflow-hidden"
        >
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                <Brain size={12} />
                <span>AI Training Hub</span>
              </div>

              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Ready to Evolve the Model?
              </h2>

              <p className="text-muted-foreground text-sm leading-relaxed">
                We have collected <span className="text-primary font-semibold">{negativeFeedbacks.length}</span> feedback samples.
                Initiate training to integrate these edge cases.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 min-w-fit">
              <button
                onClick={handleTrain}
                className="group relative px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm shadow-md shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <Cpu size={16} className="animate-pulse" />
                  Start Training v{Math.floor(negativeFeedbacks.length / 10) + 1}.0
                </span>
              </button>
              
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Evaluation;

import React, { useEffect, useState } from "react";
import { CheckCircle, Cpu, Brain, AlertCircle, GitBranch, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VersionControl = () => {
    const { trainModel, createVersion, versions, fetchVersions } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(
        !!(location.state?.autoTrain && location.state?.version)
    );
    const [currentStep, setCurrentStep] = useState(0);
    const [finalStatus, setFinalStatus] = useState(null); // "success" or "failed"
    const [targetVersion, setTargetVersion] = useState(null);

    const steps = [
        "Dataset Preparation",
        "Data Preprocessing",
        "Train-Test Split",
        "Model Fitting & Training",
        "Model Evaluation",
        "Deploying Model to Production",
    ];

    const stepDurations = [2000, 4000, 1500, 16000, 3000, 2500];

    useEffect(() => {
        const runTraining = async () => {
            if (!location.state?.autoTrain) return;

            // Calculate target version once at start
            const nextVersion = versions.length > 0 ? versions[0].version + 1 : 1;
            setTargetVersion(nextVersion);

            // 1. Update Version in DB immediately
            await createVersion();

            // 2. Start Training API call
            const trainPromise = trainModel()
                .then(() => ({ success: true }))
                .catch((err) => ({ success: false }));

            // Smooth step animation with variable durations
            for (let i = 0; i < steps.length; i++) {
                setCurrentStep(i);
                await new Promise((resolve) => setTimeout(resolve, stepDurations[i]));
            }

            // Wait for actual API response
            const result = await trainPromise;

            if (result.success) {
                setFinalStatus("success");
                // Refresh versions list
                await fetchVersions();
            } else {
                setFinalStatus("failed");
            }

            // Show final status for 2 seconds
            await new Promise((resolve) => setTimeout(resolve, 2500));

            setLoading(false);
            navigate(location.pathname, { replace: true, state: {} });
        };

        runTraining();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 relative">
                {/* Background Glow */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full top-1/4 left-1/2 -translate-x-1/2"></div>
                </div>

                {/* Training Spinner - Smaller & Cleaner */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-24 h-24 mb-8"
                >
                    <div className="absolute inset-0 rounded-full border-[3px] border-primary/20 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full border-[3px] border-t-primary animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Brain size={32} className="text-primary drop-shadow-sm animate-pulse" />
                    </div>
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center mb-8 tracking-tight">
                    Training Model v{targetVersion}.0
                </h2>

                {/* Step Timeline - More Compact */}
                <div className="w-full max-w-md space-y-3">
                    {steps.map((step, index) => {
                        const isCompleted = index < currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    scale: isCurrent ? 1.02 : 1,
                                }}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300
                                  ${isCompleted
                                        ? "bg-green-500/5 border-green-500/20 text-green-600"
                                        : isCurrent
                                            ? "bg-primary/5 border-primary/20 text-primary shadow-sm ring-1 ring-primary/10"
                                            : "bg-card/50 border-border/50 text-muted-foreground"
                                    }`}
                            >
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold transition-colors duration-300
                                    ${isCompleted
                                            ? "bg-green-500 text-white border-green-500"
                                            : isCurrent
                                                ? "border-primary text-primary bg-primary/10"
                                                : "border-muted-foreground/30 bg-muted/10"
                                        }`}
                                >
                                    {isCompleted ? <CheckCircle size={14} /> : index + 1}
                                </div>

                                <span className={`text-sm font-medium ${isCurrent ? 'text-primary' : ''}`}>
                                    {step}
                                </span>

                                {isCurrent && (
                                    <Cpu size={16} className="ml-auto animate-spin text-primary opacity-80" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Final Status */}
                {finalStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-8 px-6 py-4 rounded-xl text-center shadow-lg border backdrop-blur-sm
                                ${finalStatus === "success"
                                ? "bg-green-500/10 border-green-500/20 text-green-700"
                                : "bg-red-500/10 border-red-500/20 text-red-600"
                            }`}
                    >
                        {finalStatus === "success" ? (
                            <div className="flex items-center gap-3">
                                <CheckCircle size={24} />
                                <div>
                                    <h3 className="font-bold text-sm">Training Successful</h3>
                                    <p className="text-xs opacity-90">Model deployed to production.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <AlertCircle size={24} />
                                <div>
                                    <h3 className="font-bold text-sm">Training Failed</h3>
                                    <p className="text-xs opacity-90">Please check logs.</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                    <GitBranch size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Model Version Control</h1>
                    <p className="text-muted-foreground">
                        Current active model version and history.
                    </p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Version</th>
                                <th className="px-6 py-4">Release Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {versions.map((v, i) => (
                                <tr key={v._id || i} className="hover:bg-accent/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-primary">v{v.version}.0</td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {i === 0 ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                                                <CheckCircle size={12} />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-600">
                                                Deprecated
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {versions.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-muted-foreground">
                                        No versions found. Start training to create the first version.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VersionControl;

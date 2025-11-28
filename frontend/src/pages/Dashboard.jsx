import React from "react";
import { motion } from "framer-motion";
import StatCard from "../components/StatCard";
import {
  Users,
  Activity,
  FileText,
  HeartPulse,
  TrendingUp,
  Brain,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// SAMPLE DATA (replace with backend later)
const patientTrend = [
  { month: "Jan", patients: 120 },
  { month: "Feb", patients: 200 },
  { month: "Mar", patients: 180 },
  { month: "Apr", patients: 260 },
  { month: "May", patients: 320 },
];

const riskDistribution = [
  { category: "Low", count: 420 },
  { category: "Medium", count: 180 },
  { category: "High", count: 62 },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-10">

      {/* --- Animated Stats Cards --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <StatCard icon={<Users />} label="Total Patients" value="1,024" />
        <StatCard icon={<Activity />} label="AI Predictions" value="543" />
        <StatCard icon={<FileText />} label="Uploaded Reports" value="87" />
      </motion.div>

      {/* --- Line Chart --- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-card border border-border rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-primary" /> Patient Growth Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={patientTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="patients"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5, fill: "#6366f1" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* --- Bar Chart --- */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-card border border-border rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Brain className="text-primary" /> Risk Level Distribution
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

    </div>
  );
};

export default Dashboard;

import React from "react";
import { motion } from "framer-motion";
import ChartCard from "../components/ChartCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { feature: "Heart Rate", importance: 85 },
  { feature: "SPO₂", importance: 78 },
  { feature: "Temperature", importance: 62 },
  { feature: "Respiration", importance: 70 },
  { feature: "Blood Pressure", importance: 91 },
];

const Charts = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-10"
    >
      <ChartCard title="Feature Importance Analysis (AI Model)">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="feature" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
            />
            <Bar
              dataKey="importance"
              fill="var(--color-primary)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Model Prediction Confidence (Demo)">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={[
              { feature: "Normal", value: 72 },
              { feature: "Risk", value: 28 },
            ]}
          >
            <XAxis dataKey="feature" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>
  );
};

export default Charts;

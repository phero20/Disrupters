import React from "react";
import { motion } from "framer-motion";

const ChartCard = ({ title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl border border-border bg-card shadow-lg hover:shadow-xl transition-all"
    >
      {/* Title */}
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-primary">▍</span> {title}
      </h3>

      {/* Chart / Content */}
      <div className="w-full min-h-[300px]">{children}</div>
    </motion.div>
  );
};

export default ChartCard;

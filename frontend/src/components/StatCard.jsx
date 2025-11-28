import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ icon, label, value }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-xl border border-border bg-card shadow-sm flex items-center gap-4"
    >
      <div className="p-3 bg-primary/10 text-primary rounded-lg">
        {icon}
      </div>

      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <h2 className="text-xl font-bold text-foreground">{value}</h2>
      </div>
    </motion.div>
  );
};

export default StatCard;

import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="w-full flex justify-center py-10">
      <motion.div
        className="w-10 h-10 border-4 border-med-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
    </div>
  );
};

export default Loader;

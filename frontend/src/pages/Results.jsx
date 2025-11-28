import React from "react";
import Loader from "../components/Loader";
import ModelAccuracyCard from "../components/ModelAccuracyCard";

const Results = () => {
  return (
    <div className="p-6 space-y-6">
      <Loader text="Analyzing model..." />

      <ModelAccuracyCard accuracy={92} precision={88} recall={90} f1={89} />
    </div>
  );
};

export default Results;

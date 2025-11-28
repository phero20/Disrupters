import React from "react";
import DataPreviewTable from "../components/DataPreviewTable";

const testPatients = [
  { name: "Alex Carter", age: 54, risk: "High" },
  { name: "Sameera Khan", age: 39, risk: "Medium" },
  { name: "David Lee", age: 71, risk: "Critical" },
  { name: "Megha Roy", age: 28, risk: "Low" },
];

const Patients = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-2">Patients Overview</h1>
      <p className="text-muted-foreground mb-4">
        All patient records loaded from the system.
      </p>

      <DataPreviewTable data={testPatients} />
    </div>
  );
};

export default Patients;

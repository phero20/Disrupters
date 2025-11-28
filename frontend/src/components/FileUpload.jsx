import React, { useState } from "react";
import { Upload, FileUp, X } from "lucide-react";
import { motion } from "framer-motion";

const FileUpload = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const uploaded = e.dataTransfer.files[0];
    setFile(uploaded);
    onFileSelect(uploaded);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary transition"
    >
      {!file ? (
        <>
          <Upload size={40} className="text-primary mb-4" />
          <p className="text-muted-foreground mb-2">
            Drag & drop your dataset (CSV/XLSX)
          </p>

          <label className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-lg">
            Choose File
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files[0];
                setFile(f);
                onFileSelect(f);
              }}
            />
          </label>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-3"
        >
          <FileUp size={24} className="text-primary" />
          <span className="font-medium">{file.name}</span>
          <button
            onClick={() => setFile(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;

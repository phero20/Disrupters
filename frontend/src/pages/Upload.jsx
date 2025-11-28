import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import DataPreviewTable from "../components/DataPreviewTable";

const Upload = () => {
  const [data, setData] = useState([]);

  return (
    <div className="p-6 space-y-6">
      <FileUpload onFileSelect={(file) => console.log(file)} />

      <DataPreviewTable data={data} />
    </div>
  );
};

export default Upload;

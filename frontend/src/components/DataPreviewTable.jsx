import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Table2, AlertCircle } from "lucide-react";

const DataPreviewTable = ({ data }) => {
  const [query, setQuery] = useState("");

  if (!data || data.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center p-10 border border-border rounded-xl bg-card shadow-sm"
      >
        <AlertCircle className="text-muted-foreground mb-2" size={32} />
        <p className="text-muted-foreground">No preview available.</p>
      </motion.div>
    );

  const columns = Object.keys(data[0]);

  const filtered = data.filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border border-border rounded-xl bg-card shadow-md"
    >
      {/* Header Tools */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Table2 className="text-primary" size={20} />
          <h2 className="font-semibold">Patient Records</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setQuery(e.target.value)}
            className="px-10 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-accent/40 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="p-3 text-left font-medium text-muted-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="border-t border-border hover:bg-accent/20 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col} className="p-3 whitespace-nowrap">
                    {row[col]}
                  </td>
                ))}
              </motion.tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-muted-foreground"
                >
                  No matching results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 text-xs text-muted-foreground border-t border-border">
        Showing {filtered.length} of {data.length} rows
      </div>
    </motion.div>
  );
};

export default DataPreviewTable;

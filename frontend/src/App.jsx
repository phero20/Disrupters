import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import Charts from "./pages/Charts";
import Diagnostics from "./pages/Diagnostics";
import Reports from "./pages/Reports";

import "./App.css";
import Sidebar from "./components/shared/Navbar";
import Patients from "./pages/Pateints";

function App() {
  return (
    <div className="bg-background min-h-screen text-foreground font-sans selection:bg-primary/20">
      
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area → shifted right on desktop */}
      <main className="mt-20 md:px-30 max-md:pb-28">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Main Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/results" element={<Results />} />
          <Route path="/charts" element={<Charts />} />

          {/* MedTech Pages */}
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>

    </div>
  );
}

export default App;

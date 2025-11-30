import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  AlertTriangle,
  TrendingUp,
  Users,
  Microscope,
  Dna,
  Zap
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const Dashboard = () => {
  const { allFeedbacks } = useAuth();

  // ==========================================
  // 📊 DATA PROCESSING
  // ==========================================
  const stats = useMemo(() => {
    if (!allFeedbacks.length) return null;

    const total = allFeedbacks.length;
    const diseaseCases = allFeedbacks.filter(f => f.is_disease).length;
    const avgConfidence = allFeedbacks.reduce((acc, curr) => acc + curr.confidence, 0) / total;

    // Mock accuracy calculation (assuming feedback 'no' means incorrect)
    const incorrect = allFeedbacks.filter(f => f.feedback === 'no').length;
    const accuracy = ((total - incorrect) / total) * 100;

    return {
      total,
      diseaseCases,
      avgConfidence: (avgConfidence * 100).toFixed(1),
      accuracy: accuracy.toFixed(1),
      riskRate: ((diseaseCases / total) * 100).toFixed(1)
    };
  }, [allFeedbacks]);

  // 1. SCATTER PLOT: Age vs BMI
  const scatterData = useMemo(() => {
    return allFeedbacks.map(f => ({
      age: f.age,
      bmi: f.bmi,
      status: f.is_disease ? "Disease" : "Healthy",
      fill: f.is_disease ? "#ef4444" : "#22c55e" // Red vs Green
    }));
  }, [allFeedbacks]);

  // 2. RADAR CHART: Enzyme Fingerprint
  const radarData = useMemo(() => {
    if (!allFeedbacks.length) return [];

    const healthy = allFeedbacks.filter(f => !f.is_disease);
    const disease = allFeedbacks.filter(f => f.is_disease);

    const getAvg = (arr, key) => arr.reduce((acc, curr) => acc + curr[key], 0) / (arr.length || 1);

    return [
      { subject: 'ALT', A: getAvg(healthy, 'alt'), B: getAvg(disease, 'alt'), fullMark: 150 },
      { subject: 'AST', A: getAvg(healthy, 'ast'), B: getAvg(disease, 'ast'), fullMark: 150 },
      { subject: 'ALP', A: getAvg(healthy, 'alp'), B: getAvg(disease, 'alp'), fullMark: 150 },
      { subject: 'Bilirubin', A: getAvg(healthy, 'bilirubin'), B: getAvg(disease, 'bilirubin'), fullMark: 10 },
      { subject: 'Albumin', A: getAvg(healthy, 'albumin'), B: getAvg(disease, 'albumin'), fullMark: 10 },
    ];
  }, [allFeedbacks]);

  // 3. AREA CHART: Confidence Trend
  const areaData = useMemo(() => {
    return allFeedbacks
      .slice()
      .reverse() // Oldest first
      .map((f, i) => ({
        name: `P${i + 1}`,
        confidence: (f.confidence * 100).toFixed(1),
        is_disease: f.is_disease
      }));
  }, [allFeedbacks]);

  // 4. BAR CHART: Symptom Frequency
  const barData = useMemo(() => {
    const counts = {};
    allFeedbacks.forEach(f => {
      if (f.symptoms && Array.isArray(f.symptoms)) {
        f.symptoms.forEach(s => {
          counts[s] = (counts[s] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5
  }, [allFeedbacks]);

  // 5. DONUT CHART: Gender
  const pieData = useMemo(() => {
    const male = allFeedbacks.filter(f => f.sex === 'Male').length;
    const female = allFeedbacks.filter(f => f.sex === 'Female').length;
    return [
      { name: 'Male', value: male, color: '#3b82f6' },
      { name: 'Female', value: female, color: '#ec4899' },
    ];
  }, [allFeedbacks]);

  if (!stats) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Activity className="mx-auto mb-4 animate-bounce" size={48} />
        <h2 className="text-xl font-bold">Waiting for Data...</h2>
        <p>Start making predictions to populate the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="text-primary" />
            AI Performance Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time analytics of the diagnostic model's behavior.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm">
          <Zap size={16} className="fill-current" />
          Live System Status: ONLINE
        </div>
      </div>

      {/* 1. KEY METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <MetricCard
          title="Model Accuracy"
          value={`${stats.accuracy}%`}
          sub="Based on feedback"
          icon={TrendingUp}
          color="text-green-500"
          bg="bg-green-500/10"
        /> */}
        <MetricCard
          title="Avg Confidence"
          value={`${stats.avgConfidence}%`}
          sub="Prediction certainty"
          icon={Brain}
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <MetricCard
          title="High Risk Cases"
          value={stats.diseaseCases}
          sub={`${stats.riskRate}% of total`}
          icon={AlertTriangle}
          color="text-red-500"
          bg="bg-red-500/10"
        />
        <MetricCard
          title="Total Predictions"
          value={stats.total}
          sub="All time processed"
          icon={Activity}
          color="text-purple-500"
          bg="bg-purple-500/10"
        />
      </div>

      {/* 2. MAIN CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ROW 1: SCATTER & RADAR */}
        <ChartCard title="The Liver Landscape (Age vs BMI)" colSpan="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
              <XAxis type="number" dataKey="age" name="Age" unit=" yrs" />
              <YAxis type="number" dataKey="bmi" name="BMI" unit="" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Scatter name="Patients" data={scatterData} fill="#8884d8">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Enzyme Fingerprint (Healthy vs Disease)">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#333" opacity={0.1} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
              <Radar name="Healthy" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              <Radar name="Disease" dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              <Legend />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ROW 2: AREA, BAR, PIE */}
        <ChartCard title="Confidence Wave (Trend)" colSpan="lg:col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis domain={[0, 100]} />
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Area type="monotone" dataKey="confidence" stroke="#8884d8" fillOpacity={1} fill="url(#colorConf)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Demographics">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Symptoms" colSpan="lg:col-span-3">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const MetricCard = ({ title, value, sub, icon: Icon, color, bg }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4"
  >
    <div className={`p-4 rounded-xl ${bg} ${color}`}>
      <Icon size={28} />
    </div>
    <div>
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children, colSpan = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col ${colSpan}`}
  >
    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
      <Microscope size={18} className="text-primary opacity-50" />
      {title}
    </h3>
    <div className="flex-1 w-full min-h-[200px]">
      {children}
    </div>
  </motion.div>
);

export default Dashboard;

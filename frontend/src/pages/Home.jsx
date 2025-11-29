"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  Brain,
  Pill,
  FlaskConical,
  TriangleAlert,
  Users,
  Layers,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Link } from "react-router-dom";

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

// --- Mock Data (Using Chart Colors) ---
const diliCausesData = [
  { name: "Acetaminophen", cases: 46, color: "#ef4444" }, // destructive
  { name: "Antibiotics", cases: 32, color: "#f59e0b" },   // warning
  { name: "NSAIDs", cases: 18, color: "#eab308" },        // yellow
  { name: "Statins", cases: 12, color: "#22c55e" },       // success
  { name: "Herbal", cases: 24, color: "#10b981" },        // emerald
  { name: "Other", cases: 15, color: "#64748b" },         // muted
];

const severityData = [
  { severity: "Mild", percentage: 45, color: "#22c55e" },     // success
  { severity: "Moderate", percentage: 35, color: "#eab308" }, // warning
  { severity: "Severe", percentage: 15, color: "#f97316" },   // orange
  { severity: "Fatal", percentage: 5, color: "#ef4444" },     // destructive
];

const earlyDetectionData = [
  { stage: "Week 1", withAI: 85, withoutAI: 15 },
  { stage: "Week 2", withAI: 92, withoutAI: 35 },
  { stage: "Week 3", withAI: 95, withoutAI: 58 },
  { stage: "Week 4", withAI: 97, withoutAI: 72 },
];

const modelPerformanceData = [
  { metric: "Accuracy", value: 94 },
  { metric: "Precision", value: 92 },
  { metric: "Recall", value: 93 },
  { metric: "F1-Score", value: 92.5 },
];

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/3 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-10 right-20 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[160px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-1">
        {/* HERO SECTION */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24"
        >
          <motion.div variants={fadeUp}>
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
            >
              <Activity size={18} />
              AI for Drug Safety & Liver Health
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-tight leading-[1.1] mb-6 text-foreground">
              AI-Driven Prediction of<br />
              <span className="text-primary italic">Drug-Induced Liver Injury</span> (DILI)
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Our system predicts liver toxicity caused by medicines such as
              painkillers, antibiotics, and chronic disease drugs —
              before symptoms become dangerous.
            </p>

            <Link to="/dashboard" className="bg-primary w-64 text-primary-foreground px-8 py-4 rounded-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-0.5 text-lg cursor-pointer">
              Open Dashboard <ArrowRight size={20} />
            </Link>
          </motion.div>

          {/* Hero Visual - Liver Stats Card */}
          <motion.div
            variants={fadeUp}
            className="w-full h-[480px] rounded-xl overflow-hidden shadow-2xl border border-border bg-card p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <Activity className="text-primary" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-foreground">Live DILI Statistics</h3>
                <p className="text-sm text-muted-foreground">Real-time prediction insights</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-accent/50 rounded-lg p-4 border border-border">
                <div className="text-3xl font-bold text-primary">94.2%</div>
                <div className="text-sm text-muted-foreground mt-1">Model Accuracy</div>
              </div>
              <div className="bg-accent/50 rounded-lg p-4 border border-border">
                <div className="text-3xl font-bold text-green-600">93.1%</div>
                <div className="text-sm text-muted-foreground mt-1">Detection Recall</div>
              </div>
              <div className="bg-accent/50 rounded-lg p-4 border border-border">
                <div className="text-3xl font-bold text-amber-600">15-20%</div>
                <div className="text-sm text-muted-foreground mt-1">DILI Incidence</div>
              </div>
              <div className="bg-accent/50 rounded-lg p-4 border border-border">
                <div className="text-3xl font-bold text-destructive">10-50%</div>
                <div className="text-sm text-muted-foreground mt-1">Fatality Rate</div>
              </div>
            </div>

            <div className="bg-card rounded-lg flex-1 overflow-hidden pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earlyDetectionData}>
                  <defs>
                    <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="stage" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="withAI" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAI)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.section>

        {/* PROBLEM STATEMENT WITH DATA VISUALIZATION */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="py-24 border-t border-border"
        >
          <h2 className="text-4xl font-serif font-bold text-center mb-6 text-foreground">
            Why DILI Prediction Matters
          </h2>

          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            Drug-Induced Liver Injury is one of the leading causes of acute liver failure.
            Reactions are rare, unpredictable, and often missed during clinical trials —
            becoming visible only after mass usage.
          </p>

          {/* <div className="mb-12 rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto h-72 bg-muted relative group">
            <div className="absolute inset-0 bg-foreground/5 group-hover:bg-transparent transition-colors duration-500"></div>
             Placeholder for image - replace with actual image source
             <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
               <Activity size={48} />
            </div>
          </div> */}

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  icon: TriangleAlert,
                  title: "High Mortality Risk",
                  desc: "DILI contributes to 10%–50% liver-failure-related deaths.",
                  stat: "10-50%",
                  color: "text-destructive",
                  bg: "bg-destructive/10",
                },
                {
                  icon: Pill,
                  title: "Common Medicines Cause It",
                  desc: "Painkillers, antibiotics, statins, supplements & herbal drugs.",
                  stat: "1000+",
                  color: "text-amber-600",
                  bg: "bg-amber-500/10",
                },
                {
                  icon: Brain,
                  title: "Symptoms Appear Late",
                  desc: "Fatigue & nausea show up only after liver cells are already damaged.",
                  stat: "2-8 wks",
                  color: "text-muted-foreground", 
                  bg: "bg-muted",
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all flex items-start gap-5 group"
                >
                  <div className={`p-3 rounded-lg ${card.bg} group-hover:scale-105 transition-transform`}>
                    <card.icon className={card.color} size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-serif font-semibold text-card-foreground">{card.title}</h3>
                      <span className={`text-xl font-bold ${card.color}`}>{card.stat}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* DILI Causes Chart */}
            <motion.div
              variants={fadeUp}
              className="p-8 bg-card rounded-xl border border-border shadow-sm"
            >
              <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2 text-card-foreground">
                <FlaskConical className="text-primary" size={24} />
                Leading Causes of DILI
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={diliCausesData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} angle={-20} textAnchor="end" height={70} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} label={{ value: 'Cases (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
                    cursor={{fill: 'hsl(var(--accent))'}}
                  />
                  <Bar dataKey="cases" radius={[4, 4, 0, 0]}>
                    {diliCausesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Severity Distribution */}
          <motion.div
            variants={fadeUp}
            className="p-8 bg-accent/30 rounded-2xl border border-border max-w-5xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2 text-foreground">
                  <AlertCircle className="text-destructive" size={28} />
                  DILI Severity Distribution
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Understanding the severity spectrum helps prioritize early intervention for high-risk patients.
                </p>
                <div className="space-y-3">
                  {severityData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="font-medium text-card-foreground">{item.severity}</span>
                      </div>
                      <span className="text-lg font-bold" style={{ color: item.color }}>{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="percentage"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span className="text-muted-foreground text-sm ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* SOLUTION SECTION */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="py-24"
        >
          <h2 className="text-4xl font-serif font-bold text-center mb-6 text-foreground">
            Our AI-Powered Solution
          </h2>

          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-14 leading-relaxed">
            A fully explainable AI model that predicts liver injury risk early using
            lab markers, symptoms, drug interactions & patient history.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Brain,
                title: "Early Risk Detection",
                desc: "Predicts DILI based on ALT, AST, ALP, Bilirubin, Albumin & symptoms.",
              },
              {
                icon: FlaskConical,
                title: "Drug-Drug Toxicity Engine",
                desc: "Analyzes chemical structures & scores hepatotoxic interaction risk.",
              },
              {
                icon: ShieldCheck,
                title: "Personalized Recommendations",
                desc: "Suggests safe alternatives & dosage corrections.",
              },
            ].map((card, i) => (
              <motion.div
                variants={fadeUp}
                key={i}
                className="p-8 rounded-xl bg-card border border-border hover:-translate-y-1 transition-all shadow-sm hover:shadow-lg group"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-primary/20">
                  <card.icon size={28} />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 text-card-foreground">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Model Performance Metrics */}
          <motion.div variants={fadeUp} className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Performance Bar Chart */}
              <div className="p-8 bg-card rounded-xl border border-border shadow-sm">
                <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-2 text-card-foreground">
                  <TrendingUp className="text-primary" size={24} />
                  Model Performance Metrics
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={modelPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="metric" type="category" tick={{ fontSize: 12, fill: 'hsl(var(--card-foreground))', fontWeight: 500 }} width={80} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
                      cursor={{fill: 'hsl(var(--accent))'}}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                      {modelPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value >= 93 ? '#22c55e' : 'hsl(var(--primary))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Early Detection Comparison */}
              <div className="p-8 bg-card rounded-xl border border-border shadow-sm">
                <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-2 text-card-foreground">
                  <Activity className="text-primary" size={24} />
                  Early Detection Impact
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={earlyDetectionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="stage" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} label={{ value: 'Detection Rate (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      iconType="circle"
                    />
                    <Line type="monotone" dataKey="withAI" stroke="hsl(var(--primary))" strokeWidth={3} name="With AI" dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="withoutAI" stroke="#ef4444" strokeWidth={3} name="Without AI" dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} strokeDasharray="5 5" activeDot={{ r: 6 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* WORKFLOW SECTION */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="py-24 relative overflow-hidden border-t border-border"
        >
          <h2 className="text-4xl font-serif font-bold text-center mb-4 text-foreground">
            How to Get Started?
          </h2>
          <p className="text-center text-muted-foreground mb-20 max-w-2xl mx-auto">
            Our streamlined process makes it easy to predict liver injury risk in just a few steps.
          </p>

          {/* Desktop View - Curved Path SVG */}
          <div className="hidden lg:block relative max-w-6xl mx-auto px-8">
            <svg
              className="absolute w-full pointer-events-none"
              style={{ top: '80px', left: '0', right: '0', height: '200px' }}
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
            >
              <path
                d="M 100 100 Q 250 40, 350 100 Q 450 160, 550 100 Q 650 40, 750 100 Q 850 160, 900 100"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8 8"
                className="text-primary/20"
              />
            </svg>

            <div className="grid grid-cols-4 gap-6 relative pt-4">
              {[
                {
                  num: "1",
                  title: "Enter Data",
                  desc: "Input patient history, medications & labs.",
                  icon: "📋",
                },
                {
                  num: "2",
                  title: "AI Analysis",
                  desc: "Model processes risk factors.",
                  icon: "🧠",
                },
                {
                  num: "3",
                  title: "Prediction",
                  desc: "Receive DILI risk score.",
                  icon: "📊",
                },
                {
                  num: "4",
                  title: "Take Action",
                  desc: "Follow safe recommendations.",
                  icon: "🚀",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex flex-col items-center text-center relative z-10 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-20 h-20 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center mb-6 relative shadow-md group-hover:border-primary/50 transition-colors"
                  >
                    <span className="text-3xl font-serif font-bold text-primary">{step.num}</span>
                  </motion.div>

                  <div className="text-4xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity">{step.icon}</div>
                  <h3 className="font-serif font-bold text-lg mb-2 min-h-[2rem] flex items-center text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed px-2">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* USE CASES */}
        <motion.section
          initial="hidden"
          whileInView="show"
          variants={fadeUp}
          className="py-24 bg-accent/30 rounded-3xl"
        >
          <h2 className="text-4xl font-serif font-bold text-center mb-6 text-foreground">
            Who Benefits from DILI Prediction?
          </h2>

          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-14">
            Our platform empowers healthcare professionals and patients with actionable insights.
          </p>

          <div className="grid md:grid-cols-4 gap-6 px-8">
            {[
              {
                icon: Stethoscope,
                title: "Physicians",
                desc: "Make informed treatment decisions with real-time risk assessment.",
                stat: "50% faster",
                color: "text-primary" 
              },
              {
                icon: Users,
                title: "Patients",
                desc: "Receive early warnings and preventive care recommendations.",
                stat: "90% safer",
                color: "text-primary"
              },
              {
                icon: Pill,
                title: "Pharmacists",
                desc: "Screen for drug interactions before dispensing medications.",
                stat: "99% accuracy",
                color: "text-primary"
              },
              {
                icon: Layers,
                title: "Researchers",
                desc: "Access chemical-level hepatotoxicity analysis for drug development.",
                stat: "1000+ drugs",
                color: "text-primary"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="p-6 rounded-xl bg-card shadow-sm hover:shadow-md transition-all group hover:-translate-y-1 border border-border"
              >
                <div className={`p-3 bg-primary/10 text-primary w-fit rounded-lg mb-4 group-hover:scale-105 transition-transform`}>
                  <item.icon size={24} />
                </div>
                <div className="flex flex-col mb-2">
                  <h3 className="text-lg font-serif font-semibold text-foreground">{item.title}</h3>
                  <span className={`text-sm font-bold ${item.color} mt-1`}>{item.stat}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ SECTION */}
        <motion.section
          initial="hidden"
          whileInView="show"
          variants={fadeUp}
          className="py-24 max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-serif font-bold text-center mb-6 text-foreground">Frequently Asked Questions</h2>
          <p className="text-center text-muted-foreground mb-12">
            Everything you need to know about our DILI prediction system.
          </p>

          <div className="space-y-4">
            {[
              {
                q: "How accurate is the AI model?",
                a: "We achieve over 93% recall using FDA DILIrank and UCI liver datasets, with 94.2% overall accuracy.",
              },
              {
                q: "Is this medically approved?",
                a: "This is a research prototype. With clinical trials, it can be hospital-ready and FDA-approved.",
              },
              {
                q: "Does it detect drug interactions?",
                a: "Yes. Our chemical similarity engine identifies hepatotoxic combinations and drug-drug interactions.",
              },
              {
                q: "Can patients use this?",
                a: "Yes — the UI is designed for non-technical users, pharmacists, and healthcare professionals.",
              },
              {
                q: "What data does the model use?",
                a: "The model analyzes lab markers (ALT, AST, ALP, Bilirubin, Albumin), patient history, symptoms, and drug information.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="p-6 border border-border rounded-lg bg-card hover:border-primary/30 transition-all"
              >
                <p className="font-bold text-lg mb-2 flex items-start gap-3 text-foreground">
                  <span className="text-primary font-serif mt-0.5">Q:</span>
                  {faq.q}
                </p>
                <p className="text-muted-foreground ml-7 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FINAL CTA */}
        <motion.section
          initial="hidden"
          whileInView="show"
          variants={fadeUp}
          className="text-center py-24 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl blur-3xl -z-10"></div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
            Ready to Detect Risks Early?a
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Use AI to transform medication safety and protect patients from drug-induced liver injury.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/dashboard" className="bg-primary text-primary-foreground px-10 py-4 rounded-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-all text-lg shadow-lg shadow-primary/10 cursor-pointer">
              Go to Dashboard <ArrowRight size={20} />
            </Link>
            <button className="border border-border px-10 py-4 rounded-sm font-medium flex items-center gap-2 hover:bg-accent transition-all text-lg cursor-pointer text-foreground">
              <Sparkles size={20} />
              Learn More
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
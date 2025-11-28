import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  Stethoscope,
  ShieldCheck,
  LineChart,
  Cpu,
  HeartPulse,
  ArrowRight,
  Brain,
} from "lucide-react";

// Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/30 blur-[160px] rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-500/40 blur-[160px] rounded-full opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ---------------------------------------------------------
            HERO SECTION (with scroll animation)
        ----------------------------------------------------------- */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-32 md:py-25"
        >
          {/* LEFT TEXT */}
          <motion.div variants={fadeUp}>
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Activity size={18} />
              MedTech Innovation 2025
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
              AI-Powered <span className="text-primary">Patient Monitoring</span><br />
              for Hospitals
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
              A next-generation predictive analytics system that helps hospitals
              detect anomalies, monitor patient health in real-time, and improve
              clinical decision-making using advanced AI.
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex gap-4 flex-wrap"
            >
              <Link
                to="/dashboard"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all text-lg shadow-lg shadow-primary/20"
              >
                Open Dashboard <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            variants={fadeUp}
            className="relative w-full h-[430px] rounded-3xl overflow-hidden shadow-xl border border-border"
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="https://img.freepik.com/premium-photo/smart-healthcare-with-aipowered-patient-monitoring-hospitals-using-ai-continuous-patient-monitoring-alerts_1230253-22203.jpg?semt=ais_hybrid"
              alt="Medical Dashboard UI"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/5" />
          </motion.div>
        </motion.div>

        {/* ---------------------------------------------------------
            STATS SECTION (scroll animated)
        ----------------------------------------------------------- */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-28"
        >
          {[
            { label: "Patients Monitored", value: "42,000+", icon: HeartPulse },
            { label: "Prediction Accuracy", value: "96.4%", icon: LineChart },
            { label: "Hospitals Using", value: "85+", icon: ShieldCheck },
            { label: "Data Processed", value: "12M+", icon: Cpu },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.03, y: -4 }}
              className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary mb-4">
                <item.icon size={26} />
              </div>
              <h3 className="text-3xl font-bold">{item.value}</h3>
              <p className="text-muted-foreground text-sm mt-1">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ---------------------------------------------------------
            FEATURES SECTION
        ----------------------------------------------------------- */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Built for Modern Healthcare
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI engine enhances clinical accuracy, reduces workload and enables
              faster medical decisions.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32"
          >
            {[
              {
                title: "Real-time Vitals Monitoring",
                desc: "Track heart rate, SPO₂, temperature and more with instant anomaly alerts.",
                icon: Stethoscope,
                color: "text-primary bg-primary/10",
              },
              {
                title: "Risk Prediction AI",
                desc: "ML models that detect patient deterioration before it happens.",
                icon: Brain,
                color: "text-blue-600 bg-blue-500/10",
              },
              {
                title: "Automated Alerts",
                desc: "Smart notifications for abnormalities to assist clinical teams.",
                icon: ShieldCheck,
                color: "text-green-600 bg-green-500/10",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.03, y: -6 }}
                className="p-8 rounded-3xl border border-border bg-card shadow-md transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.color} mb-6`}>
                  <card.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ---------------------------------------------------------
            FINAL CTA
        ----------------------------------------------------------- */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="pb-36 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Start Monitoring Patients Smarter
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Experience the next generation of AI-powered hospital monitoring
            built for clinicians, nurses and healthcare systems.
          </p>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/dashboard"
              className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-lg shadow-lg mx-auto w-fit"
            >
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

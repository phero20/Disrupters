import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Users, Calendar, Mail, User } from "lucide-react";
import Loader from "../components/Loader";

const Patients = () => {
  const { fetchPatients, user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      if (user?.role === 'Pharmacist') {
        setLoading(true);
        const data = await fetchPatients();
        setPatients(data || []);
        setLoading(false);
      }
    };
    loadPatients();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Registered Patients</h1>
          <p className="text-muted-foreground">
            List of all users registered as patients in the system.
          </p>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-2xl">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-medium">No Patients Found</h3>
          <p className="text-muted-foreground">
            There are no registered patients in the system.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {patients.map((patient) => (
                  <motion.tr
                    key={patient._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 font-medium">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                          {patient.fullname?.charAt(0) || "U"}
                        </div>
                        {patient.fullname}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        {patient.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600">
                        {patient.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

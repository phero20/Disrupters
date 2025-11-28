import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  User,
  Stethoscope,
  FileText,
  Users,
  ChevronDown
} from "lucide-react";
import AuthModal from "./AuthModal";
import { useAuth } from "../../context/AuthContext";
import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // UPDATED: MedTech specific navigation items
const navItems = [
  { name: "Home", path: "/", icon: <Activity size={16} /> },
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { name: "Upload Data", path: "/upload", icon: <Stethoscope size={16} /> },
  { name: "Results", path: "/results", icon: <FileText size={16} /> },
  { name: "Charts", path: "/charts", icon: <Users size={16} /> },

  // MedTech Domain Pages
  { name: "AI Diagnostics", path: "/diagnostics", icon: <Stethoscope size={16} /> },
  { name: "Patients", path: "/patients", icon: <Users size={16} /> },
  { name: "Reports", path: "/reports", icon: <FileText size={16} /> },
];


  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-6 border-b ${isScrolled
          ? "bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-border shadow-sm"
          : "bg-background border-transparent"
          }`}
      >
        <div className="max-w-360 mx-auto px-2 flex items-center justify-between">

          {/* LOGO AREA */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-lg transition-colors duration-300 ${isScrolled
              ? "bg-primary text-primary-foreground"
              : "bg-card text-primary border border-border"
              }`}>
              <Activity size={28} className="group-hover:animate-pulse" />
            </div>
            <div className="flex flex-col mb-1">
              <span className="text-2xl font-bold tracking-tight text-foreground transition-colors duration-300">
                MediWatch
              </span>
              <span className="text-[10px] font-medium text-primary uppercase tracking-widest leading-none">
                AI Healthcare
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.name} to={item.path}>
                  <div className="relative px-4 py-2 group rounded-md hover:bg-accent transition-colors flex items-center gap-2">
                    <span className={`relative z-10 text-md font-medium transition-colors duration-200 ${isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-accent-foreground"
                      }`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-4">
            <ModeToggle />

            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-full border border-border bg-card hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {user?.fullname?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                    {user?.fullname || "User"}
                  </span>
                  <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover shadow-lg p-1 z-50"
                    >
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-sm font-medium text-foreground">{user?.fullname}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>

                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors">
                        <User size={16} />
                        Profile
                      </Link>
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors">
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>

                      <div className="h-px bg-border my-1" />

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut size={16} />
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="text-md font-medium text-muted-foreground hover:text-primary transition-colors px-2 cursor-pointer"
              >
                Log in
              </motion.button>
            )}

            {/* CTA Button */}
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 cursor-pointer text-primary-foreground px-5 py-2.5 rounded-full font-medium text-md shadow-md transition-all duration-300"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </motion.button>
            </Link>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[70px] left-0 right-0 bg-background border-b border-border shadow-xl z-40 lg:hidden overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              <div className="flex justify-end">
                <ModeToggle />
              </div>
              {isAuthenticated && (
                <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user?.fullname?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{user?.fullname}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
              )}

              {navItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent hover:text-accent-foreground group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground group-hover:text-primary">{item.icon}</span>
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary" />
                  </Link>
                </motion.div>
              ))}

              <hr className="border-border my-2" />

              <div className="flex flex-col gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors border border-red-200 dark:border-red-900 rounded-lg cursor-pointer"
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 text-muted-foreground hover:text-foreground font-medium transition-colors border border-border rounded-lg cursor-pointer"
                  >
                    <User size={18} />
                    Log in
                  </button>
                )}

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-lg font-semibold transition-colors shadow-sm"
                >
                  <LayoutDashboard size={18} />
                  Access Console
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;


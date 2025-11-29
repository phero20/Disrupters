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

  // Resize Handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll Handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation Routes
  const navItems = [
    { name: "Home", path: "/", icon: <Activity size={16} /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={16} /> },
    { name: "Upload Data", path: "/upload", icon: <Stethoscope size={16} /> },
    { name: "Results", path: "/results", icon: <FileText size={16} /> },
    { name: "Charts", path: "/charts", icon: <Users size={16} /> },
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
      {/* ----------------------------------------------
                TOP NAVBAR
      ----------------------------------------------- */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 py-3 md:py-6 border-b transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-border shadow-sm"
            : "bg-background border-transparent"
        }`}
      >
        <div className="max-w-360 mx-auto px-2 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className={`p-2 rounded-lg transition-colors ${
                isScrolled
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-primary border border-border"
              }`}
            >
              <Activity size={28} className="group-hover:animate-pulse" />
            </div>
            <div className="flex flex-col mb-1">
              <span className="text-2xl font-bold tracking-tight">MediWatch</span>
              <span className="text-[10px] font-medium text-primary uppercase">
                AI Healthcare
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.name} to={item.path}>
                  <div className="relative px-4 py-2 flex items-center gap-2 rounded-md hover:bg-accent transition-colors">
                    <span
                      className={`text-md font-medium ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-accent-foreground"
                      }`}
                    >
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
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-border bg-card hover:bg-accent"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {user?.fullname?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm max-w-[100px] truncate">{user?.fullname}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                {/* USER DROPDOWN */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover shadow-lg p-1 z-50"
                    >
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-sm font-medium">{user?.fullname}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-lg"
                      >
                        <User size={16} /> Profile
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-lg"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <LogOut size={16} /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-md text-muted-foreground hover:text-primary"
              >
                Log in
              </button>
            )}

            <Link to="/dashboard">
              <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full">
                <LayoutDashboard size={16} /> Dashboard
              </button>
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

      {/* ----------------------------------------------
                MOBILE NAV MENU (DROPDOWN)
      ----------------------------------------------- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[70px] left-0 right-0 bg-background backdrop-blur-lg border-b border-border z-40 lg:hidden"
          >
            <div className="p-6 flex flex-col gap-4">

              <div className="flex justify-end">
                <ModeToggle />
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight size={16} />
                </Link>
              ))}

              <hr className="border-border" />

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-3 text-red-500 rounded-lg border"
                >
                  Log out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-3 rounded-lg border"
                >
                  Log in
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------
                MOBILE BOTTOM NAVIGATION
      ----------------------------------------------- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 border-t border-border backdrop-blur-xl">
        <div className="grid grid-cols-5 text-center py-2">
          {[
            { name: "Home", path: "/", icon: Activity },
            { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
            { name: "Diagnostics", path: "/diagnostics", icon: Stethoscope },
            { name: "Patients", path: "/patients", icon: Users },
            { name: "Reports", path: "/reports", icon: FileText },
          ].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => (window.location.href = item.path)}
                className="flex flex-col items-center justify-center gap-1"
              >
                <item.icon
                  size={22}
                  className={`${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-[10px] ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AUTH MODAL */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;

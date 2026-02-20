import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Home, Phone } from "lucide-react";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Seo
        title="Page Not Found"
        description="Sorry, we couldn’t find the page you’re looking for."
        path="/404"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-primary/10 rounded-full blur-[120px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/5 border border-primary/10 mb-6">
            <Compass className="text-accent" size={28} />
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            404
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-primary/70">
            The page you’re seeking has wandered off.
          </p>
          <p className="mt-1 text-sm text-primary/50">
            Try returning to a safe place or reach out to us.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/" className="group">
              <div className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-accent hover:text-primary transition flex items-center gap-2">
                <Home size={18} className="group-hover:text-primary" />
                Back to Home
              </div>
            </Link>
            <Link to="/contact" className="group">
              <div className="px-6 py-3 rounded-2xl border border-primary/30 text-primary font-bold text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition flex items-center gap-2">
                <Phone size={18} />
                Contact Us
              </div>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-primary/10 p-6 sm:p-8"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-widest text-primary/40">
                Quick Access
              </div>
              <div className="text-sm font-semibold text-primary">
                Explore popular sections
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-accent/10" />
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Rooms", path: "/rooms" },
              { name: "Tariff", path: "/tariff" },
              { name: "Gallery", path: "/gallery" },
              { name: "Attractions", path: "/attractions" },
            ].map((item) => (
              <Link key={item.name} to={item.path}>
                <div className="w-full rounded-xl border border-primary/10 bg-primary/3 text-primary text-sm font-medium py-3 text-center hover:border-accent hover:text-accent transition">
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
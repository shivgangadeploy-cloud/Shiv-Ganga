import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import bgImage from "../assets/homepage-images/banner-two.webp";
import { useSystemSettings } from "../context/SystemSettingsContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const { settings } = useSystemSettings();
  const { property } = settings;

  return (
    <footer className="relative text-white pt-16 sm:pt-20 md:pt-28 pb-10 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/85" />

      {/* MAIN GRID */}
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-14"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        {/* BRAND */}
        <div className="space-y-6 text-center sm:text-left">
          <Link
            to="/"
            className="inline-block hover:scale-105 transition-transform"
          >
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-[0.35em] uppercase">
              {property.hotelName}
            </h2>
            <p className="text-accent text-[10px] tracking-[0.45em] uppercase mt-1">
              Luxury Stay
            </p>
          </Link>

          <p className="text-sm leading-relaxed max-w-xs mx-auto sm:mx-0 opacity-90">
            Experience the epitome of luxury and Indian heritage. Your sanctuary
            in the heart of the city, where every detail is curated for comfort.
          </p>

          <div className="flex justify-center sm:justify-start gap-4">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-primary transition-all duration-300 group"
              >
                <Icon
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="text-center sm:text-left">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-6">
            Quick Links
          </h3>

          <ul className="space-y-3 inline-block sm:block">
            {[
              { name: "About Us", path: "/about" },
              { name: "Accommodations", path: "/rooms" },
              { name: "Tariff", path: "/tariff" },
              { name: "Gallery", path: "/gallery" },
              { name: "Attractions", path: "/attractions" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="group inline-flex items-center text-sm hover:text-accent transition"
                >
                  <span className="w-0 overflow-hidden group-hover:w-4 transition-all text-accent">
                    <ArrowRight size={12} />
                  </span>
                  <span className="group-hover:translate-x-2 transition-transform">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div className="text-center sm:text-left">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-6">
            Contact Us
          </h3>

          <ul className="space-y-5 max-w-sm mx-auto sm:mx-0">
            <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <MapPin className="text-accent shrink-0" size={20} />
              <span className="text-sm leading-relaxed break-words">
                {property.address}
              </span>
            </li>

            <li className="flex flex-col sm:flex-row items-center gap-3">
              <Phone className="text-accent shrink-0" size={20} />
              <span className="text-sm break-words text-center sm:text-left">
                {property.phones?.join(", ")}
              </span>
            </li>

            <li className="flex flex-col sm:flex-row items-center gap-3">
              <Mail className="text-accent shrink-0" size={20} />
              <div className="flex flex-col gap-1 text-sm">
                {property.emails?.map((email, idx) => (
                  <a
                    key={idx}
                    href={`mailto:${email}`}
                    className="hover:text-accent transition break-all"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="text-center sm:text-left">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-6">
            Newsletter
          </h3>

          <p className="text-sm mb-5 opacity-90 max-w-xs mx-auto sm:mx-0">
            Subscribe for exclusive offers and hotel updates.
          </p>

          <form
            className="flex flex-col gap-3 max-w-xs mx-auto sm:mx-0"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your Email Address"
              className="bg-white/10 border border-white/30 px-4 py-3 rounded-md text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-accent"
            />

            <button className="bg-white text-primary hover:bg-accent hover:text-white py-3 rounded-md text-xs font-bold uppercase tracking-widest transition">
              Subscribe
            </button>
          </form>
        </div>
      </motion.div>

      {/* BOTTOM BAR */}
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-white/30 flex flex-col md:flex-row gap-4 justify-between items-center text-[11px] sm:text-xs"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <p className="text-center md:text-left">
          © {currentYear} {property.hotelName}. All Rights Reserved.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/privacypolicy" className="hover:text-accent transition">
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-servicespolicy"
            className="hover:text-accent transition"
          >
            Terms of Service
          </Link>
          <Link
            to="/cancellationpolicy"
            className="hover:text-accent transition"
          >
            Cancellation Policy
          </Link>
        </div>
      </motion.div>
    </footer>
  );
}

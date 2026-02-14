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
    <footer className="relative text-white pt-14 sm:pt-20 md:pt-28 pb-10 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/85" />

      {/* MAIN GRID */}
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
    gap-10 lg:gap-16 mb-14 text-left"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        {/* BRAND */}
        <div className="space-y-5">
          <Link
            to="/"
            className="inline-block hover:scale-105 transition-transform"
          >
            <h2 className="text-xl sm:text-3xl font-serif font-bold tracking-[0.3em] uppercase">
              {property.hotelName}
            </h2>
            <p className="text-accent text-[10px] tracking-[0.4em] uppercase mt-1">
              Luxury Stay
            </p>
          </Link>

          <p className="text-sm leading-relaxed opacity-90 max-w-sm">
            Experience the epitome of luxury and Indian heritage. Your sanctuary
            in the heart of the city, where every detail is curated for comfort.
          </p>

          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full border border-white/40
            flex items-center justify-center
            hover:bg-accent hover:border-accent hover:text-primary
            transition-all duration-300 group"
              >
                <Icon
                  size={16}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-5">
            Quick Links
          </h3>

          <ul className="space-y-2">
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
        <div>
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-5">
            Contact Us
          </h3>

          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="text-accent shrink-0 mt-1" size={18} />
              <span>{property.address}</span>
            </li>

            <li className="flex items-center gap-3">
              <Phone className="text-accent shrink-0" size={18} />
              <span>{property.phones?.join(", ")}</span>
            </li>

            <li className="flex items-start gap-3">
              <Mail className="text-accent shrink-0 mt-1" size={18} />
              <div className="flex flex-col gap-1">
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
        <div>
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-5">
            Newsletter
          </h3>

          <p className="text-sm mb-4 opacity-90 max-w-sm">
            Subscribe for exclusive offers and hotel updates.
          </p>

          <form
            className="flex flex-col gap-3 max-w-sm"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your Email Address"
              className="bg-white/10 border border-white/30 px-4 py-3
          rounded-md text-sm text-white placeholder:text-white/60
          focus:outline-none focus:border-accent"
            />

            <button
              className="bg-white text-primary hover:bg-accent hover:text-white
          py-3 rounded-md text-xs font-bold uppercase tracking-widest transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </motion.div>

      {/* BOTTOM BAR */}
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-6
    border-t border-white/30
    flex flex-col md:flex-row gap-3
    justify-between items-start md:items-center
    text-[11px] sm:text-xs text-left"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <p>
          © {currentYear} {property.hotelName}. All Rights Reserved.
        </p>

        <div className="flex flex-wrap gap-5">
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
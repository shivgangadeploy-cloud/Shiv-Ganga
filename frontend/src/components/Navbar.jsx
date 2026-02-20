import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo1.webp";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= MENU DATA ================= */

const menuLeft = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Accommodations", path: "/rooms" },
  { name: "Tariff", path: "/tariff" },
];

const menuRight = [
  { name: "Gallery", path: "/gallery" },
  { name: "Attractions", path: "/attractions" },
  { name: "Contact", path: "/contact" },
];

/* ================= NAVBAR ================= */

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-xl"
            : "bg-white/70 backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-8">
          {/* GRID → prevents overlap */}
          <div className="grid grid-cols-3 items-center h-[60px] sm:h-[72px]">
            {/* LEFT */}
            <div className="flex items-center gap-4 justify-start">
              <button
                className="lg:hidden p-2 rounded-lg text-primary hover:bg-gray-100 transition"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>

              {/* Desktop Left Menu */}
              <div className="hidden lg:flex items-center gap-8">
                {menuLeft.map((item) => (
                  <NavItem key={item.path} item={item} active={pathname} />
                ))}
              </div>
            </div>

            {/* CENTER LOGO */}
            <div className="flex justify-center">
              <Link to="/">
                <img
                  src={logo}
                  alt="Shiv Ganga"
                  className="h-10 sm:h-10 md:h-14 lg:h-16 rounded-2xl object-contain"
                />
              </Link>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-end gap-6">
              {/* Desktop Right Menu */}
              <div className="hidden lg:flex items-center gap-8">
                {menuRight.map((item) => (
                  <NavItem key={item.path} item={item} active={pathname} />
                ))}

                <Link
                  to="/booking"
                  className="bg-primary hover:bg-accent text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition"
                >
                  Book Now
                </Link>
              </div>

              {/* Mobile / Tablet Book */}
              <Link
                to="/booking"
                className="lg:hidden bg-primary text-white px-4 py-2 rounded-lg shadow-md text-sm hover:bg-accent transition"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed top-0 left-0 w-[80%] max-w-sm h-screen bg-white z-50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <img src={logo} alt="logo" className="h-14 object-contain" />
                <button onClick={() => setIsOpen(false)}>
                  <X />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-lg">
                {[...menuLeft, ...menuRight].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`transition ${
                      pathname === item.path
                        ? "text-primary font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <Link
                  to="/booking"
                  className="mt-8 bg-primary text-white py-3 text-center rounded-xl"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= NAV ITEM ================= */

function NavItem({ item, active }) {
  const isActive = active === item.path;

  return (
    <Link
      to={item.path}
      className={`relative font-medium transition ${
        isActive ? "text-primary" : "text-gray-700 hover:text-primary"
      }`}
    >
      {item.name}
      <span
        className={`absolute left-0 -bottom-2 h-[2px] bg-primary transition-all duration-300 ${
          isActive ? "w-full" : "w-0 hover:w-full"
        }`}
      />
    </Link>
  );
}
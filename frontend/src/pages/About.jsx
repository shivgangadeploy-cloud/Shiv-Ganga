import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import Testimonials from "../pages/Homepage/Testimonials";
import { useSystemSettings } from "../context/SystemSettingsContext";

import aboutHero from "../assets/homepage-images/banner-one.webp";
import about1 from "../assets/aboutpage/gallery1.webp";
import about2 from "../assets/aboutpage/gallery8.webp";
import about3 from "../assets/aboutpage/about-1.webp";
import about4 from "../assets/aboutpage/about-hero2.webp";

/* ---------------- ANIMATION VARIANTS ---------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const stagger = {
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const float = {
  animate: {
    y: [0, -10, 0],
    transition: { repeat: Infinity, duration: 6, ease: "easeInOut" },
  },
};

/* ---------------- PAGE ---------------- */

export default function About() {
  const { settings } = useSystemSettings();
  const { property } = settings;

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      {/* ================= HERO ================= */}
<section className="relative min-h-[60vh] lg:min-h-[85vh] overflow-hidden bg-slate-900 w-full flex items-center transition-all duration-500">

  {/* Background */}
  <div className="absolute inset-0 z-0">
    <motion.img
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1.1, opacity: 1 }}
      transition={{ duration: 1.5 }}
      src={aboutHero}
      alt={property.hotelName}
      className="w-full h-full object-cover blur-[2px] opacity-50 scale-110"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
  </div>

  {/* Content */}
  <div className="container mx-auto px-6 h-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-10 lg:py-0">

    {/* TEXT */}
    <div className="flex flex-col justify-center text-center lg:text-left lg:items-start max-w-2xl mx-auto lg:mx-0">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif text-white tracking-tight leading-tight mb-5 drop-shadow-lg">
          A Stay Rooted in <br className="hidden lg:block" />
          <span className="text-accent drop-shadow-2xl">
            Comfort & Care
          </span>
        </h1>

        <div className="w-16 h-1 bg-amber-400 mb-6 mx-auto lg:mx-0 rounded-full" />

        <p className="text-sm md:text-base text-gray-200 font-light leading-relaxed opacity-90 max-w-lg mx-auto lg:mx-0">
          Hotel {property.hotelName} blends warm hospitality with modern
          comfort, offering a peaceful stay experience in Rishikesh.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm backdrop-blur-sm">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span>4.1 Rated by Guests</span>
        </div>
      </motion.div>
    </div>

    {/* FLOATING COLLAGE */}
    <div className="hidden lg:flex relative h-[500px] w-full justify-center items-center">

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-[10%] right-[15%] w-60 h-40 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-10 rotate-6 backdrop-blur-sm"
      >
        <img
          src={about1}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
        />
      </motion.div>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="absolute top-[35%] left-[10%] w-72 h-48 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-20 -rotate-3 backdrop-blur-sm"
      >
        <img
          src={about2}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
        />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="absolute bottom-[20%] right-[8%] w-56 h-40 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-30 rotate-3 backdrop-blur-sm"
      >
        <img
          src={about3}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
        />
      </motion.div>

    </div>
  </div>
</section>


      {/* ================= BLOCKS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-4 py-20 space-y-24">
        <Block
          image={about1}
          title="A Refined Retreat in Rishikesh"
          subtitle={`Why Choose ${property.hotelName}`}
          points={[
            "Warm & attentive hospitality",
            "Calm interiors",
            "Serene surroundings",
          ]}
        >
          Amid the tranquil beauty of Rishikesh, Hotel {property.hotelName}
          offers a refined retreat designed for rest and renewal.
        </Block>

        <Block
          image={about2}
          title="Rooms & Stay Experience"
          reverse
          points={["Elegant rooms", "Modern comforts", "Family friendly"]}
        >
          Each room at {property.hotelName} is a sanctuary of peace, blending
          soft lighting and thoughtful amenities.
        </Block>

        <Block
          image={about3}
          title="Leisure & Wellness"
          points={[
            "Thoughtful amenities",
            "Peaceful atmosphere",
            "Memorable stays",
          ]}
        >
          Whether relaxing or exploring, your time at {property.hotelName}
          feels calm, refined and rejuvenating.
        </Block>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-14">
        <Testimonials />
      </section>

      {/* ================= GALLERY ================= */}
      <section className="py-24 bg-gradient-to-b from-[#0F2A44] to-[#081726]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-accent uppercase tracking-widest text-xs">
              Gallery
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-serif text-white">
              Inside {property.hotelName}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="h-[300px] sm:h-[380px] md:h-[460px] rounded-3xl overflow-hidden"
            >
              <img src={about4} className="w-full h-full object-cover" />
            </motion.div>

            <div className="grid grid-rows-2 gap-6">
              <div className="grid grid-cols-2 gap-6">
                {[about1, about2].map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="h-[160px] sm:h-[200px] rounded-2xl overflow-hidden"
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-[180px] sm:h-[220px] rounded-2xl overflow-hidden"
              >
                <img src={about3} className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- BLOCK ---------------- */

function Block({ image, title, subtitle, children, points, reverse }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center"
    >
      <div className={reverse ? "lg:order-2" : ""}>
        <img
          src={image}
          className="h-[260px] sm:h-[340px] md:h-[420px] w-full object-cover rounded-3xl shadow-xl"
        />
      </div>

      <div>
        {subtitle && (
          <span className="text-accent uppercase tracking-widest text-xs block mb-3">
            {subtitle}
          </span>
        )}

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#0F2A44] mb-6">
          {title}
        </h2>

        <p className="text-gray-600 leading-relaxed mb-8">{children}</p>

        <div className="space-y-3">
          {points.map((p, i) => (
            <Feature key={i} text={p} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- FEATURE ---------------- */

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3 text-[#0F2A44]">
      <CheckCircle className="text-accent" size={18} />
      <span>{text}</span>
    </div>
  );
}

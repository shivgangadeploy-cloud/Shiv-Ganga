import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import spa from "../../assets/homepage-images/spa.webp";
import lounge from "../../assets/homepage-images/lounge.webp";
import breakfast from "../../assets/homepage-images/breakfast.webp";
import glass from "../../assets/homepage-images/glass.webp";
import bell from "../../assets/homepage-images/bell.webp";
import { motion } from "framer-motion";
import { useSystemSettings } from "../../context/SystemSettingsContext";

const RoomCollage = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  const { settings } = useSystemSettings();
  const { property } = settings;

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20 max-w-7xl mx-auto px-6 pt-24">
      {/* Collage Container - Mobile/Tablet (Grid) */}
      <div className="lg:hidden order-2 grid grid-cols-2 gap-4 w-full">
        <div className="rounded-2xl overflow-hidden shadow-lg h-36 sm:h-40 md:h-48">
          <img
            src={spa}
            alt="Spa"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg h-36 sm:h-40 md:h-48">
          <img
            src={lounge}
            alt="Lounge"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg h-36 sm:h-40 md:h-48">
          <img
            src={breakfast}
            alt="Breakfast"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg h-36 sm:h-40 md:h-48">
          <img
            src={glass}
            alt="Dining"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="col-span-2 rounded-2xl overflow-hidden shadow-lg h-44 sm:h-48 relative flex items-center justify-center bg-white">
          <img
            src={bell}
            alt="Service"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          {/* <div className="relative z-10 bg-white/80 p-3 rounded-full shadow-md">
            <ArrowRight className="text-primary" size={24} />
          </div> */}
        </div>
      </div>

      {/* Collage Container - Desktop (Absolute) */}
      <div className="hidden lg:block lg:order-1 relative w-[650px] h-[550px] mx-auto lg:mx-0 shrink-0">
        {/* Left Column */}
        <div className="absolute left-0 top-[40px] w-[260px] space-y-4">
          {/* Top Left: Spa */}
          <div className="h-[200px] rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <img
              src={spa}
              alt="Spa Amenities"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Bottom Left: Lounge */}
          <div className="h-[180px] rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <img
              src={lounge}
              alt="Lounge Area"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="absolute left-[280px] top-0 w-[280px] space-y-4">
          {/* Top Right: Breakfast */}
          <div className="h-[180px] rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <img
              src={breakfast}
              alt="Breakfast"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Bottom Right: Dining */}
          <div className="h-[220px] rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <img
              src={glass}
              alt="Dining"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Floating Bell Circle */}
        <div className="absolute left-[440px] bottom-[60px] w-[140px] h-[140px] rounded-full border-[6px] border-white shadow-2xl overflow-hidden z-20 group">
          <img
            src={bell}
            alt="Service"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Right Content: Explore Button */}
      <div className="flex-1 w-full order-1 lg:order-2">
        <div className="gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="order-2 lg:order-1 lg:max-w-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-accent text-xs uppercase tracking-[0.3em] font-bold">
                About Us
              </span>
              <div className="h-[1px] w-12 bg-accent"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif text-primary mb-8 leading-[1.1]">
              Why Choose{" "}
              <span className="text-accent italic">Hotel {property.hotelName}?</span>
            </h2>
            <p className="text-primary leading-relaxed mb-8 text-lg font-light">
              Amid the tranquil beauty of Rishikesh, Hotel {property.hotelName} offers a
              refined retreat where calm and care meet pure luxury. Thoughtfully
              designed for travellers who seek both quiet and comfort, {property.hotelName} brings you the spirit of Rishikesh into every detail of your
              stay.
            </p>
            <p className="text-primary leading-relaxed mb-12 text-lg font-light">
              From the moment you arrive, you will notice the care in small
              things: warm hospitality, curated interiors, and rooms that invite
              luxury and calmness. The view outside will remind you why
              Rishikesh is called the yoga capital of the world. Service here is
              attentive but discreet. Every request of yours is handled with a
              calm, professional touch.
            </p>

            <div className="flex gap-12 mb-12">
              <div>
                <h4 className="text-4xl font-serif text-primary mb-2">25+</h4>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  Years of Service
                </p>
              </div>
              <div>
                <h4 className="text-4xl font-serif text-primary mb-2">50+</h4>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  Luxury Rooms
                </p>
              </div>
            </div>

            <Link
              to="/about"
              className="group inline-flex items-center text-primary font-bold uppercase tracking-widest text-xs border-b border-primary/20 pb-2 hover:border-accent hover:text-accent transition-colors"
            >
              Our Story & Hotel Philosophy{" "}
              <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoomCollage;

import React, { useState } from "react";
import { ATTRACTIONS as ATTRACTION_DETAILS } from "../AttractionDetailsNew";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ExploreAttraction = () => {
  const [activeAttraction, setActiveAttraction] = useState(1); // Default center active

  // Convert object to array for mapping
  const nearbyAttractions = Object.entries(ATTRACTION_DETAILS).map(
    ([id, value]) => ({
      id,
      title: value.title,
      desc: value.overview,
      distance: value.distance,
      img: value.images?.[0],
    })
  );

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-accent text-xs uppercase tracking-[0.3em] font-bold block mb-4">
            Near By Attraction
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary">
            Explore Rishikesh
          </h2>
        </div>

        {/* Attractions Accordion */}
        <div className="max-w-7xl mx-auto h-[800px] lg:h-[500px] flex flex-col lg:flex-row gap-4">
          {nearbyAttractions.slice(0, 3).map((item, index) => (
            <motion.div
              key={item.id}
              layout
              onClick={() => setActiveAttraction(index)}
              initial={{ borderRadius: "2rem" }}
              animate={{
                flex: activeAttraction === index ? 3 : 1,
                borderRadius: activeAttraction === index ? "32px" : "100px", // Pill shape for inactive
              }}
              transition={{ duration: 0.1, type: "spring", bounce: 0.15 }}
              className={`relative overflow-hidden cursor-pointer shadow-lg group ${
                activeAttraction !== index ? "grayscale hover:grayscale-0" : ""
              } transition-all duration-300`}
            >
              {/* Image */}
              <img
                src={item.img}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay - Active State */}
              <AnimatePresence>
                {activeAttraction === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8"
                  >
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="text-3xl lg:text-4xl font-serif text-accent mb-3"
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="text-gray-200 mb-6 line-clamp-2 max-w-xl"
                    >
                      {item.desc}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                    >
                      <Link
                        to={`/attractions/${item.id}`}
                        className="inline-flex items-center gap-2 text-white border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full hover:bg-accent hover:text-primary transition-all w-fit group/btn"
                      >
                        Explore{" "}
                        <ArrowRight
                          size={18}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Inactive Overlay - Darker to emphasize active */}
              {activeAttraction !== index && (
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Explore All Attractions Button */}
        <div className="mt-15 text-center">
          <Link
            to="/attractions"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-2xl group"
          >
            View All Attractions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExploreAttraction;

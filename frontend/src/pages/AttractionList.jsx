import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

/* ===== SAME IDS AS AttractionDetailsNew ===== */
const ATTRACTIONS = {
  "triveni-ghat": {
    title: "Triveni Ghat",
    desc: "The most sacred bathing ghat in Rishikesh",
    distance: "2.5 km",
    category: "Spiritual",
    image:
      "https://www.hotelshivgangarishikesh.com/assets/images/attractions/a1.jpg",
  },
  "laxman-jhula": {
    title: "Laxman Jhula",
    desc: "Iconic suspension bridge over the Ganges",
    distance: "1.2 km",
    category: "Heritage",
    image:
      "https://www.hotelshivgangarishikesh.com/assets/images/attractions/a4.jpg",
  },
  "beatles-ashram": {
    title: "The Beatles Ashram",
    desc: "Historic meditation retreat of The Beatles",
    distance: "3.8 km",
    category: "History",
    image:
      "https://www.hotelshivgangarishikesh.com/assets/images/attractions/a6.jpg",
  },
  "neelkanth-temple": {
    title: "Neelkanth Mahadev Temple",
    desc: "Sacred Shiva temple in the mountains",
    distance: "32 km",
    category: "Spiritual",
    image:
      "https://www.hotelshivgangarishikesh.com/assets/images/attractions/a5.jpg",
  },
  "parmarth-niketan": {
    title: "Parmarth Niketan Ashram",
    desc: "Famous for yoga and evening Ganga Aarti",
    distance: "2.1 km",
    category: "Yoga & Spiritual",
    image:
      "https://wildhawk.in/wp-content/uploads/2019/05/parmarth-niketan-ashram-rishikesh-head-606.jpeg",
  },
  "tera-manzil": {
    title: "Tera Manzil Temple",
    desc: "13-storey temple near Laxman Jhula",
    distance: "1.5 km",
    category: "Spiritual",
    image:
      "https://www.hotelshivgangarishikesh.com/assets/images/attractions/a7.jpg",
  },
  "vashishta-gufa": {
    title: "Vashishta Gufa",
    desc: "Ancient meditation cave by the Ganges",
    distance: "25 km",
    category: "Meditation",
    image:
      "https://www.hotelshivgangarishikesh.com/assets/images/attractions/a3.jpg",
  },
  "rajaji-national-park": {
    title: "Rajaji National Park",
    desc: "Wildlife reserve and jungle safari",
    distance: "18 km",
    category: "Wildlife",
    image:
      "https://www.hotelshivgangarishikesh.com/assets/images/attractions/a8.jpg",
  },
};

export default function AttractionsList() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-amber-50/20 to-gray-50 ">
      <div className="container mx-auto px-6 py-10">
        {/* ===== HEADER ===== */}

        {/* ===== ATTRACTIONS GRID ===== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(ATTRACTIONS)
            .slice(0, 4)
            .map(([id, item], index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="h-[480px]"
              >
                <Link
                  to={`/attractions/${id}`}
                  className="group relative block h-full rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700"
                >
                  {/* IMAGE */}
                  <div className="absolute inset-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 group-hover:from-black/90 transition-all duration-700"></div>

                  {/* DISTANCE */}
                  <div className="absolute top-6 right-6 z-10">
                    <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <MapPin size={14} className="text-amber-600" />
                      <span className="text-xs font-bold text-gray-900 tracking-wide">
                        {item.distance}
                      </span>
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div className="absolute top-6 left-6 z-10">
                    <div className="bg-amber-600/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <h3 className="text-2xl font-serif text-white mb-3 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="flex items-center gap-2 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="tracking-wide">Explore Destination</span>
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-2 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* BORDER */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/50 rounded-2xl transition-all duration-500 pointer-events-none"></div>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}

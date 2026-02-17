import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import attractionHeroImg from '../assets/homepage-images/attraction-hero-img.webp';
import gangaAartiImg from "../assets/ganga-aarti.webp";
import beatlesAshramImg from "../assets/beatleashram.webp";
import jhulaImg from "../assets/Jhulaimg.webp";
import nationalParkImg from "../assets/nationalpark.webp";
import neelkanthImg from "../assets/neelkanth.webp";
import parmarthImg from "../assets/parmarth-niketan.webp";
import teraManzilImg from "../assets/tera-manjil.webp";
import vashishtaGufaImg from "../assets/Vashishta_Gufa_Main.webp";



const attractionsData = [
  {
    id: "triveni-ghat",
    name: "Triveni Ghat",
    distance: "2.5 km",
    desc: "The most sacred bathing ghat in Rishikesh. Famous for the mesmerizing 'Ganga Aarti' held every evening amidst chanting and oil lamps.",
    tag: "Spiritual",
    image: gangaAartiImg,
  },
  {
    id: "laxman-jhula",
    name: "Laxman Jhula",
    distance: "1.2 km",
    desc: "Iconic suspension bridges across the holy river Ganga. Perfect for morning walks, photography, and feeding the fish from the bridge.",
    tag: "Heritage",
    image: jhulaImg,
  },
  {
    id: "beatles-ashram",
    name: "The Beatles Ashram",
    distance: "3.8 km",
    desc: "Known as Chaurasi Kutia, this eco-friendly sanctuary is where The Beatles studied Transcendental Meditation. Features mesmerizing graffiti.",
    tag: "History",
    image: beatlesAshramImg,
  },
  {
    id: "parmarth-niketan",
    name: "Parmarth Niketan",
    distance: "2.1 km",
    desc: "One of the largest ashrams in Rishikesh, providing a serene environment with lush gardens and daily spiritual activities.",
    tag: "Yoga",
    image: parmarthImg,
  },
  {
    id: "neelkanth-temple",
    name: "Neelkanth Mahadev",
    distance: "32 km",
    desc: "Sacred temple dedicated to Lord Shiva situated at a height of 1330 meters. A scenic drive through the mountains.",
    tag: "Pilgrimage",
    image: neelkanthImg,
  },
  {
    id: "tera-manzil",
    name: "Tera Manzil Temple",
    distance: "1.5 km",
    desc: "Also known as Trimbakeshwar Temple, this 13-storey shrine offers panoramic views of the river from the top floors.",
    tag: "Views",
    image: teraManzilImg,
  },
  {
    id: "vashishta-gufa",
    name: "Vashishta Gufa",
    distance: "25 km",
    desc: "An ancient cave on the banks of the Ganga where Sage Vashishta is said to have meditated. Extremely peaceful.",
    tag: "Meditation",
    image: vashishtaGufaImg,
  },
  {
    id: "rajaji-national-park",
    name: "Rajaji National Park",
    distance: "18 km",
    desc: "A pristine wildlife reserve known for elephants, tigers, and diverse bird species. Great for jungle safaris.",
    tag: "Wildlife",
    image: nationalParkImg,
  },
];

const GeometricOverlay = () => (
  <div className="absolute inset-0 pointer-events-none z-20">
    <div className="absolute top-0 left-0 h-full w-[150px] md:w-[250px] bg-gradient-to-r from-black/60 to-transparent" />
    <div className="absolute top-1/2 left-10 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-full mix-blend-overlay" />
    <div className="absolute top-1/2 left-6 -translate-y-1/2 w-32 h-32 border border-white/30 rounded-full mix-blend-overlay" />
  </div>
);

const Attractions = () => {
  const [activeId, setActiveId] = useState(null);

  const handleCardClick = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen font-sans pb-20 overflow-x-hidden">
      
    
      <section className="relative min-h-[60vh] lg:min-h-[85vh] overflow-hidden bg-slate-900 w-full flex items-center transition-all duration-500">
        
      
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src={attractionHeroImg}
            alt="Background"
            className="w-full h-full object-cover blur-[2px] opacity-50 scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
        </div>

     
        <div className="container mx-auto px-6 h-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-10 lg:py-0">
          
         
          <div className="flex flex-col justify-center text-center lg:text-left lg:items-start max-w-2xl mx-auto lg:mx-0">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif text-white tracking-tight leading-tight mb-5 drop-shadow-lg">
                Explore <br className="hidden lg:block" />
                <span className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-[1.2] tracking-tight drop-shadow-2xl text-accent">Divine</span> Rishikesh
              </h1>
              <div className="w-16 h-1 bg-amber-400 mb-6 mx-auto lg:mx-0 rounded-full" />
              <p className="text-sm md:text-base text-gray-200 font-light leading-relaxed opacity-90 max-w-lg mx-auto lg:mx-0">
                Discover the spiritual tapestry of the Yoga Capital of the World. From sacred ghats to the serene peaks of the Himalayas, experience the timeless charm surrounding Hotel Shiv Ganga.
              </p>
            </motion.div>
          </div>

         
          <div className="hidden lg:flex relative h-[500px] w-full justify-center items-center">
             
          
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute top-[10%] right-[15%] w-60 h-40 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-10 rotate-6 backdrop-blur-sm"
            >
              <img src={attractionsData[1].image} alt="Collage 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>

           
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="absolute top-[35%] left-[10%] w-72 h-48 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-20 -rotate-3 backdrop-blur-sm"
            >
              <img src={attractionsData[0].image} alt="Collage 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>

            
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute bottom-[20%] right-[8%] w-56 h-40 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-30 rotate-3 backdrop-blur-sm"
            >
              <img src={attractionsData[3].image} alt="Collage 3" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>
          </div>
          
        </div>
      </section>

      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-slate-800 mb-4">
          Nearby Attractions
        </h2>
        <div className="w-16 h-1 bg-amber-400 mx-auto mb-6 rounded-full"></div>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Curated experiences just steps away from your stay.
        </p>
      </section>

   
      <div className="flex flex-col gap-5 w-full md:w-[95%] lg:w-[85%] mr-auto pl-0">
        {attractionsData.map((place) => {
          const isActive = activeId === place.id;

          return (
            <motion.div
              key={place.id}
              layout
              onClick={() => handleCardClick(place.id)}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={`relative overflow-hidden cursor-pointer shadow-xl transition-all
                  ${isActive
                    ? "h-[380px] rounded-r-full rounded-l-none" 
                    : "h-[140px] rounded-r-full rounded-l-none grayscale-[30%] hover:grayscale-0" 
                  }
                `}
            >
              <motion.div layout className="absolute inset-0 w-full h-full">
                <img
                  src={place.image}
                  alt={place.name}
                  className={`w-full h-full object-cover transition-all duration-1000 
                    ${isActive ? 'scale-110 blur-[4px]' : 'scale-100 blur-0 hover:scale-105'}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-90' : 'opacity-70'}`} />
              </motion.div>

              <GeometricOverlay /> 

              <motion.div
                layout="position"
                className={`absolute inset-0 flex px-6 md:px-16 transition-all duration-500
                    ${isActive ? "items-end pb-12" : "items-center"}
                  `}
              >
                <div className="relative z-30 max-w-4xl">
                  <motion.span
                    layout
                    className="inline-block text-amber-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-2 pl-1"
                  >
                    {place.tag}
                  </motion.span>

                  <motion.h2
                    layout="position"
                    className={`font-serif font-bold text-white leading-none mb-4
                        ${isActive ? "text-4xl md:text-6xl lg:text-4xl" : "text-2xl md:text-4xl"}
                      `}
                  >
                    {place.name}
                  </motion.h2>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-200 text-sm md:text-lg font-light mb-6 max-w-2xl border-l-4 border-amber-400 pl-6 leading-relaxed">
                          {place.desc}
                        </p>

                        <div className="flex flex-col items-start md:flex-row md:items-center gap-6 pl-1">
                          <div className="inline-flex items-center gap-3 text-white bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                            <MapPin size={20} className="text-amber-400" />
                            <span className="text-base font-semibold tracking-wide">{place.distance} Away</span>
                          </div>

                          <Link 
                            to={`/attractions/${place.id}`}
                            onClick={(e) => e.stopPropagation()} 
                          >
                            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider group hover:translate-x-2 transition-transform cursor-pointer">
                              View Full Details <ArrowRight size={18} />
                            </div>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {!isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-6 md:right-12 z-20"
                  >
                    <div className="group w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-slate-900 hover:scale-110">
                      <ArrowRight className="text-slate-900 group-hover:text-white transition-colors duration-300" size={20} />
                    </div>
                  </motion.div>
                )}
                
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Attractions;
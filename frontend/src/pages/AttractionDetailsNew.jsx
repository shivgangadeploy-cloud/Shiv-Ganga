
import React, { useEffect, useState } from "react"; 
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; 
import { ArrowLeft, Clock, Ticket, Calendar, Info, ArrowRight, MapPin, Sparkles, X, ChevronLeft, ChevronRight, ZoomIn, Car } from "lucide-react";
import AdditionalService from "./Homepage/AdditionalService";
import Seo from "../components/Seo";

export const ATTRACTIONS = {
  "triveni-ghat": {
    title: "Triveni Ghat",
    category: "Spiritual",
    distance: "2.5 km",
    images: [
      "/images/a1.webp",
      "/images/a2.webp",
      "/images/a3.webp", 
      "/images/a4.webp", 
    ],
    overview: "Experience the spiritual heart of Rishikesh in its most graceful form. The river flows gently past wide stone steps where pilgrims gather in quiet devotion. As evening arrives, the Ganga Aarti unfolds with soft chants, flickering lamps, and a sense of collective stillness that feels deeply grounding.In the early hours, the ghat is calmer, inviting you to sit, breathe, and watch the river reflect the morning light. Whether you visit at dawn or dusk, Triveni Ghat offers a moment of pause, where faith, rhythm, and serenity come together beside the sacred Ganges.",
    highlights: ["Maha Aarti (Evening)", "Holy Bathing Spot", "Pind Daan Rituals"],
    visiting: {
      timings: "Open 24 Hours",
      entryFee: "Free",
      bestTime: "Evening (6:00 PM - 7:00 PM for Aarti)",
      duration: "1 - 2 Hours",
    },
    gettingThere:
      "Located in the heart of Rishikesh city. Easily accessible by auto-rickshaw (Vikram) or taxi from Hotel Shiv Ganga.",
    tips: [
      "Arrive 45 minutes before sunset to get a good seat for the Aarti.",
      "Remove shoes before entering the ghat area.",
    ],
    nearby: [{ id: "laxman-jhula", title: "Laxman Jhula", distance: "4 km" }],
  },
  "laxman-jhula": {
    title: "Laxman Jhula & Ram Jhula",
    category: "Heritage",
    distance: "1.2 km",
    images: [
      "/images/jhula1.webp",
      "/images/jhula2.webp",
      "/images/jhula3.webp",
      "/images/jhula4.webp",
    ],
    overview: "At Lakshman Jhula, experience one of the most iconic and soulful crossings of Rishikesh. Suspended above the Ganges, the bridge offers uninterrupted views of the river as it flows between forested hills. As you walk across, the rhythm of temple bells, prayer chants, and daily life unfolds naturally around you. According to legend, Lakshmana crossed the river here during his exile, giving the bridge its spiritual significance. Nearby temples, cafés, and small shops invite you to pause and explore at an easy pace. Whether you visit early morning or near sunset, Lakshman Jhula offers a gentle connection to faith, history, and the living spirit of Rishikesh.",
    highlights: ["Panoramic River Views", "Temple Views", "Local Market"],
    visiting: {
      timings: "Open 24 Hours",
      entryFee: "Free",
      bestTime: "Early Morning or Sunset",
      duration: "45 Minutes",
    },
    gettingThere:
      "A short walk or drive from the hotel. Ram Jhula is closer to Swarg Ashram area.",
    tips: [
      "Be careful of the monkeys on the bridge.",
      "Motorcycles also use this bridge, so stay to the side.",
    ],
    nearby: [
      { id: "tera-manzil", title: "Tera Manzil Temple", distance: "500m" },
    ],
  },
  "beatles-ashram": {
    title: "The Beatles Ashram",
    category: "History",
    distance: "3.8 km",
    images: [
      "/images/beatles1.webp",
      "/images/beatles2.webp",
      "/images/beatles3.webp",
      "/images/beatles4.webp",
    ],
    overview:"Known for hosting the Beatles during their spiritual journey in the 1960s, the ashram now feels like a living canvas of thought and inspiration. As you explore, nature slowly reclaims the structures, adding to their charm. It is a place best experienced unhurriedly, allowing curiosity, creativity, and stillness to guide your steps.Hidden within forested grounds, this former meditation retreat carries a calm that lingers long after you leave. Painted meditation cells, shaded pathways, and expressive murals create a space where silence and art coexist beautifully.",
    highlights: ["Meditation Caves", "Beatles Cathedral Gallery", "Jungle Setting"],
    visiting: {
      timings: "10:00 AM – 4:00 PM",
      entryFee: "₹150 (Indians) / ₹600 (Foreigners)",
      bestTime: "Daytime",
      duration: "2 Hours",
    },
    gettingThere:
      "Located in Swarg Ashram. You can take a taxi to the entry gate or walk from Ram Jhula (approx 2km).",
    tips: [
      "Carry water as there are no shops inside.",
      "Wear comfortable walking shoes.",
    ],
    nearby: [
      { id: "parmarth-niketan", title: "Parmarth Niketan", distance: "1 km" },
    ],
  },
  "neelkanth-temple": {
    title: "Neelkanth Mahadev Temple",
    category: "Spiritual",
    distance: "32 km",
    images: [
      "/images/neelkanth1.webp",
      "/images/neelkanth2.webp",
      "/images/neelkanth3.webp",
      "/images/neelkanth4.webp"
    ],
    overview:"According to legend, this is where Lord Shiva consumed poison to save the universe, giving the temple deep spiritual meaning. At the shrine, the atmosphere is calm and reverent, shaped by the sound of bells and whispered prayers. Visitors come not only to worship, but also to feel the peaceful rhythm of the hills. Dress modestly, move mindfully, and allow the stillness of this sacred place to settle within you.Neelkanth Mahadev Temple draws you into the hills, where devotion meets nature in quiet harmony. Surrounded by forested slopes, the journey itself feels restorative, offering scenic views and fresh mountain air.",
    highlights: ["Mountain Drive", "Ancient Architecture", "Natural Spring"],
    visiting: {
      timings: "6:00 AM – 7:00 PM",
      entryFee: "Free",
      bestTime: "Morning (avoid Mondays/Shravan month for crowds)",
      duration: "Half Day Trip",
    },
    gettingThere:
      "Requires a hired taxi or private vehicle. The drive takes about 1 hour through scenic forest roads.",
    tips: [
      "The road is winding; take motion sickness precautions if needed.",
      "Prepare for queues during festivals.",
    ],
    nearby: [{ id: "laxman-jhula", title: "Laxman Jhula", distance: "30 km" }],
  },
  "parmarth-niketan": {
    title: "Parmarth Niketan Ashram",
    category: "Yoga & Spiritual",
    distance: "2.1 km",
    images: [
      "/images/pn1.webp",
      "/images/pn2.webp",
      "/images/pn3.webp",
      "/images/pn4.webp",
    ],
    overview: "Set along the river Ganga, Parmarth Niketan Ashram welcomes you into a space where daily life flows gently with spiritual practice. You’ll find yoga sessions, meditation, and moments of reflection within the serene gardens. Mornings begin quietly, with breath and movement by the Ganges, while evenings close with a graceful aarti that brings people together in shared calm. The atmosphere is open and inclusive, allowing you to participate as much or as little as you wish. Whether you attend a class or simply sit by the river, Parmarth Niketan provides a balanced experience of learning, devotion, and inner ease.",
    highlights: ["Evening Aarti", "Yoga Classes", "Statue of Lord Shiva"],
    visiting: {
      timings: "9:00 AM – 8:00 PM",
      entryFee: "Free",
      bestTime: "Evening for Aarti",
      duration: "1 Hour",
    },
    gettingThere:
      "Located in Swarg Ashram area, accessible via Ram Jhula boat or bridge.",
    tips: [
      "Dress modestly.",
      "The evening aarti here is very disciplined and musical.",
    ],
    nearby: [
      { id: "beatles-ashram", title: "Beatles Ashram", distance: "1 km" },
    ],
  },
  "tera-manzil": {
    title: "Tera Manzil Temple",
    category: "Spiritual",
    distance: "1.5 km",
    images: [
      "/images/tm1.webp",
      "/images/tm2.webp",
      "/images/tm3.webp",
      "/images/tm4.webp",
    ],
    overview: "Tera Manzil rises beside the river as a vertical expression of devotion and daily life. As you move upward through its many levels, each floor reveals small shrines, prayer spaces, and changing views of the Ganges below. The climb feels gentle rather than demanding, inviting you to pause, observe, and reflect along the way. From the upper terraces, the river and surrounding hills unfold quietly, rewarding your ascent with peaceful vistas. The temple remains active throughout the day, filled with soft chants and ritual sounds. Visit with patience and respect, and allow each level to reveal its own quiet character.",
    highlights: ["13 Floors of Deities", "Rooftop View of Ganges", "Laxman Jhula Proximity"],
    visiting: {
      timings: "6:00 AM – 7:00 PM",
      entryFee: "Free",
      bestTime: "Sunset",
      duration: "45 Minutes",
    },
    gettingThere:
      "Right next to Laxman Jhula. You can walk there easily from the bridge.",
    tips: [
      "Be prepared to climb many stairs.",
      "Shoes must be removed at the entrance.",
    ],
    nearby: [{ id: "laxman-jhula", title: "Laxman Jhula", distance: "50m" }],
  },
  "vashishta-gufa": {
    title: "Vashishta Gufa",
    category: "Meditation",
    distance: "25 km",
    images: [
      "/images/gufa1.webp",
      "/images/gufa2.webp",
      "/images/gufa3.webp",
      "/images/gufa4.webp",
    ],
    overview: "Vashishta Gufa offers you a retreat into silence, away from the movement of the town. Tucked into the hillside, this meditation cave is associated with Sage Vashishta, who is believed to have practiced deep contemplation here. The approach is calm and shaded, and the cave itself feels cool and still, encouraging a quiet presence. A simple shrine rests inside, free from ornamentation, reflecting the simplicity of the space. Visitors often sit in silence, allowing thoughts to settle naturally. This is not a place to rush. Walk softly, speak little, and let the peaceful atmosphere guide you inward.",
    highlights: ["Ancient Meditation Cave", "Ganga River Bank", "Deep Silence"],
    visiting: {
      timings: "12:00 PM – 3:00 PM (Cave usually closes for rest)",
      entryFee: "Free",
      bestTime: "Morning",
      duration: "2 - 3 Hours",
    },
    gettingThere:
      "Located on the Rishikesh-Badrinath highway. Requires a taxi hire (approx 45 mins drive).",
    tips: [
      "Silence is strictly maintained inside the cave.",
      "There is a small ashram attached.",
    ],
    nearby: [
      { id: "neelkanth-temple", title: "Neelkanth Temple", distance: "40 km" },
    ],
  },
  "rajaji-national-park": {
    title: "Rajaji National Park",
    category: "Wildlife",
    distance: "18 km",
    images: [
      "/images/nationalpark1.webp",
      "/images/nationalpark2.webp",
      "/images/nationalpark3.webp",
      "/images/nationalpark4.webp",
    ],
    overview: "A breathtaking blend of scenic beauty and rich biodiversity that instantly captivates nature lovers and wildlife enthusiasts. The Park merges the three wildlife sanctuaries as The Rajaji, Motichur, and Chilla.  Forested hills, river corridors, and diverse wildlife make it an amazing destination to explore. Open from mid-November to mid-June, Rajaji promises an unforgettable escape from the hustle and bustle of city life. Rajaji National Park is not a usual go-to park but a reflection of diversity and peace.",
    highlights: ["Jungle Safari", "Elephant Sightings", "Bird Watching"],
    visiting: {
      timings: "Nov 15 – June 15 (Closed in Monsoon)",
      entryFee: "Approx ₹800-1500 (Safari Cost)",
      bestTime: "Morning or Evening Safari",
      duration: "3 - 4 Hours",
    },
    gettingThere:
      "The Chilla Range entry gate is about 18km from Rishikesh. You need to book a safari gypsy.",
    tips: [
      "Book safaris in advance.",
      "Wear dull-colored clothes to blend in with nature.",
    ],
    nearby: [{ id: "triveni-ghat", title: "Triveni Ghat", distance: "15 km" }],
  },
};

const GeometricOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 border border-white/20 rounded-full mix-blend-overlay" />
      <div className="absolute top-1/2 right-24 -translate-y-1/2 w-40 h-40 border border-white/30 rounded-full mix-blend-overlay" />
      <div className="absolute bottom-10 left-10 w-32 h-32 border border-white/10 rotate-45 rounded-xl mix-blend-overlay" />
    </div>
);


export default function AttractionDetailsNew() {
  const { id } = useParams();
  const attraction = ATTRACTIONS[id];
  const navigate = useNavigate();
  
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = (e) => {
    e.stopPropagation();
    if (attraction?.images) {
      setLightboxIndex((prev) => (prev + 1) % attraction.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (attraction?.images) {
      setLightboxIndex((prev) => (prev === 0 ? attraction.images.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage(e);
      if (e.key === "ArrowLeft") prevImage(e);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);


  if (!attraction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f1ea] px-4">
        <h2 className="text-4xl font-serif text-slate-800 mb-4">Attraction Not Found</h2>
        <Link to="/attractions" className="px-8 py-3 bg-slate-900 text-white rounded-full hover:bg-amber-500 transition-colors">
          Back to Attractions
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f1ea] min-h-screen font-sans ">
      <Seo
        title={`${attraction.title} | Rishikesh Attraction`}
        description={attraction.overview.slice(0, 160)}
        path={`/attractions/${id}`}
        image={attraction.images[0]}
      />
      
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
            >
              <X size={32} />
            </button>

            {attraction.images.length > 1 && (
              <button 
                onClick={prevImage}
                className="absolute left-4 md:left-8 text-white/70 hover:text-amber-400 bg-black/20 hover:bg-black/50 p-3 rounded-full transition-all z-50"
              >
                <ChevronLeft size={40} />
              </button>
            )}

            <motion.img
              key={lightboxIndex} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={attraction.images[lightboxIndex]}
              alt="Enlarged view"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}  />

            {attraction.images.length > 1 && (
              <button 
                onClick={nextImage}
                className="absolute right-4 md:right-8 text-white/70 hover:text-amber-400 bg-black/20 hover:bg-black/50 p-3 rounded-full transition-all z-50"
              >
                <ChevronRight size={40} />
              </button>
            )}
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 font-mono text-sm tracking-widest">
                {lightboxIndex + 1} / {attraction.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <div className="relative min-h-[55vh] md:min-h-[65vh] h-auto w-full overflow-hidden flex flex-col justify-end">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={attraction.images[0]}
            alt={attraction.title}
            className="w-full h-full object-cover blur-sm scale-110"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        <div className="absolute top-6 left-6 md:left-12 z-20">
              <Link to="/attractions" className="inline-flex items-center gap-2 text-white/90 hover:text-amber-400 transition-colors bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:border-amber-400/50">
                <ArrowLeft size={18} /> 
                <span className="text-sm font-semibold tracking-wide">Back to Attractions</span>
              </Link>
        </div>

       
        <div className="relative w-full px-5 pt-12 pb-24 md:p-12 lg:p-20 z-20 mt-16 md:mt-20"> 
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
               <div className="flex flex-wrap items-center gap-4 mb-4">
                   <span className="bg-amber-400 text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                      {attraction.category}
                   </span>
                   <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                      <MapPin size={12} className="inline mr-1 -mt-0.5" /> {attraction.distance} from Hotel
                   </span>
               </div>

               <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-2 shadow-black drop-shadow-2xl leading-tight">
                 {attraction.title}
               </h1>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-30">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl border border-white/50"
            >
            
                <div className="flex flex-wrap gap-3 mb-8">
                    {attraction.highlights.map((h, i) => (
                      <span key={i} className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-100 text-slate-700 font-semibold text-sm flex items-center gap-2 hover:bg-amber-50 hover:border-amber-200 transition-colors">
                        <Sparkles size={14} className="text-amber-500" /> {h}
                      </span>
                    ))}
                </div>

                <h2 className="text-3xl font-serif text-slate-800 mb-6">Experience</h2>
                <p className="text-slate-600 text-lg leading-relaxed font-light">
                   {attraction.overview}
                </p>

                <div className="mt-8 pt-8 border-t border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Car className="text-amber-500" size={24} /> Getting There
                    </h3>
                    <p className="text-slate-600">
                        {attraction.gettingThere}
                    </p>
                </div>
            </motion.div>

            <div>
               <h2 className="text-3xl font-serif text-slate-800 mb-6 pl-4">Gallery</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attraction.images.slice(0, 4).map((img, idx) => (
                      
                      <div 
                        key={idx} 
                        className="relative group overflow-hidden rounded-[30px] cursor-pointer"
                        onClick={() => openLightbox(idx)}
                      >
                          <img 
                            src={img} 
                            alt="Gallery" 
                            className="shadow-lg h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                             <div className="opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 text-white transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                <ZoomIn size={20} />
                             </div>
                          </div>
                      </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-1">
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl sticky top-24"
             >
                <h3 className="text-2xl font-serif text-amber-400 mb-8 border-b border-white/10 pb-4">
                   Visiting Info
                </h3>
                
                <div className="space-y-8">
                   <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors">
                          <Clock size={20} />
                      </div>
                      <div>
                          <span className="block text-xs font-bold uppercase text-white/50 mb-1">Timings</span>
                          <p className="text-lg font-medium">{attraction.visiting.timings}</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors">
                          <Ticket size={20} />
                      </div>
                      <div>
                          <span className="block text-xs font-bold uppercase text-white/50 mb-1">Entry Fee</span>
                          <p className="text-lg font-medium">{attraction.visiting.entryFee}</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors">
                          <Calendar size={20} />
                      </div>
                      <div>
                          <span className="block text-xs font-bold uppercase text-white/50 mb-1">Best Time</span>
                          <p className="text-lg font-medium">{attraction.visiting.bestTime}</p>
                      </div>
                   </div>
                   
                   <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors">
                          <Info size={20} />
                      </div>
                      <div>
                          <span className="block text-xs font-bold uppercase text-white/50 mb-1">Duration</span>
                          <p className="text-lg font-medium">{attraction.visiting.duration}</p>
                      </div>
                   </div>
                </div>

                {attraction.tips.length > 0 && (
                    <div className="mt-10 bg-white/5 p-6 rounded-3xl border border-white/5">
                        <span className="block text-sm font-bold uppercase text-amber-400 mb-4">💡 Pro Tips</span>
                        <ul className="text-sm text-gray-300 space-y-3">
                            {attraction.tips.map((tip, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="text-amber-400">•</span> {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
             </motion.div>

             {attraction.nearby && (
                 <div className="mt-8">
                     <h4 className="text-lg font-serif text-slate-800 mb-4 pl-2">Also Nearby</h4>
                     {attraction.nearby.map(near => (
                         <Link key={near.id} to={`/attractions/${near.id}`} className="block bg-white p-5 rounded-[20px] shadow-sm mb-3 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                             <div className="flex justify-between items-center">
                                 <span className="font-bold text-slate-700 group-hover:text-amber-600 transition-colors">{near.title}</span>
                                 <div className="flex items-center gap-1 text-xs text-gray-400">
                                     <MapPin size={10} /> {near.distance}
                                 </div>
                             </div>
                         </Link>
                     ))}
                 </div>
             )}
          </div>
        </div>
      </div>

      <div className="mt-16 mb-10">
         <AdditionalService />
      </div>
    </div>
  );
}

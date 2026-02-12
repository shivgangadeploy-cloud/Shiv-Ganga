import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const _motion = motion;

const ATTRACTIONS = {
  "lakshman-jhula": {
    title: "Lakshman Jhula",
    desc: "A 450-Feet Iron-Suspension Bridge",
    distance: "1.1 Km",
    category: "Key Landmark",
    images: [
      "https://i.pinimg.com/1200x/53/a1/69/53a1696c4de2bf06de05155a42eeaec0.jpg",
      "https://images.unsplash.com/photo-1518684079-3bb3e5b5b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1518684084346-5ab0be3ecfab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
    overview:
      "An iconic suspension bridge spanning the Ganges, known for its scenic views, religious significance, and vibrant surroundings of cafes, shops, and ashrams.",
    highlights: [
      "Panoramic river views",
      "Historic significance",
      "Evening ambiance",
      "Nearby cafes and shops",
    ],
    visiting: {
      timings: "Open all day",
      entryFee: "Free",
      bestTime: "Sunrise and Sunset",
      duration: "45–90 minutes",
    },
    tips: [
      "Wear comfortable footwear",
      "Carry water",
      "Expect mild crowds",
      "Respect local customs",
    ],
    gettingThere:
      "Accessible via local taxis and auto-rickshaws from central Rishikesh. Short walk from nearby parking.",
    nearby: [
      { id: "ram-jhula", title: "Ram Jhula", distance: "2.4 Km" },
      { id: "triveni-ghat", title: "Triveni Ghat", distance: "4.7 Km" },
    ],
  },
  "goa-beach": {
    title: "Goa Beach",
    desc: "White Sand Beach Near Laxman Jhula",
    distance: "1.6 Km",
    category: "Key Landmark",
    images: [
      "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyUC723LmumNAp4QO-gmKkGE5wTbb5elKRgr6sQuwM7FoyqfNkratwGAjSdMaQWkAMYWzchpASkOAeV5dLJ4b6tvWdn4uY-08YYeFQ6nz8Hy7x9JUrrY2_yo3Wg1zSO3YfjEBRt=s1360-w1360-h1020-rw",
    ],
    overview:
      "A tranquil sandy riverside spot ideal for relaxation, photography, and short walks along the Ganges.",
    highlights: ["Soft sand banks", "Quiet ambiance", "Riverside strolls"],
    visiting: {
      timings: "6:00 AM – 7:00 PM",
      entryFee: "Free",
      bestTime: "Morning and late afternoon",
      duration: "60–120 minutes",
    },
    tips: [
      "Avoid strong currents",
      "Carry light snacks",
      "Keep the area clean",
    ],
    gettingThere:
      "Short drive from Lakshman Jhula; accessible by local transport followed by a brief walk.",
    nearby: [
      { id: "lakshman-jhula", title: "Lakshman Jhula", distance: "1.1 Km" },
      { id: "ram-jhula", title: "Ram Jhula", distance: "2.4 Km" },
    ],
  },
  "ram-jhula": {
    title: "Ram Jhula",
    desc: "Yoga Capital’s Architectural Marvel",
    distance: "2.4 Km",
    category: "Key Landmark",
    images: [
      "https://i.pinimg.com/1200x/83/a4/06/83a406be7e39f5e65b494fb24ec43860.jpg",
      "https://images.unsplash.com/photo-1518684079-3bb3e5b5b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1518684084346-5ab0be3ecfab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
    overview:
      "A prominent suspension bridge linking ashrams, markets, and eateries, offering classic views of the Ganges and the ghats.",
    highlights: ["Bridge architecture", "River vistas", "Nearby ashrams"],
    visiting: {
      timings: "Open all day",
      entryFee: "Free",
      bestTime: "Golden hour",
      duration: "45–90 minutes",
    },
    tips: ["Expect pilgrims and tourists", "Carry cash for local shops"],
    gettingThere:
      "Reachable via local transport from all major points in Rishikesh.",
    nearby: [
      { id: "triveni-ghat", title: "Triveni Ghat", distance: "4.7 Km" },
      { id: "lakshman-jhula", title: "Lakshman Jhula", distance: "1.1 Km" },
    ],
  },
  "triveni-ghat": {
    title: "Triveni Ghat",
    desc: "A Sacred Bathing Spot",
    distance: "4.7 Km",
    category: "Key Landmark",
    images: [
      "https://i.pinimg.com/736x/8a/a9/cc/8aa9cc306d0cb601105acbf037372627.jpg",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1561361512-1f1bdab7eec1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
    overview:
      "A revered ghat known for evening aarti, spiritual rituals, and serene riverfront experiences.",
    highlights: ["Ganga Aarti", "Spiritual ambiance", "Photography"],
    visiting: {
      timings: "Aarti around sunset",
      entryFee: "Free",
      bestTime: "Evening",
      duration: "60–90 minutes",
    },
    tips: ["Arrive early for aarti", "Respect rituals"],
    gettingThere: "Accessible by taxi or auto from central Rishikesh.",
    nearby: [{ id: "ram-jhula", title: "Ram Jhula", distance: "2.4 Km" }],
  },
  "neergarh-waterfall": {
    title: "Neergarh Waterfall",
    desc: "The Mesmeric Waterfall of Rishikesh",
    distance: "2.1 Km",
    category: "Local Attraction",
    images: [
      "https://i.pinimg.com/1200x/62/18/74/621874955cbf15d3264b52a2290e693e.jpg",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
    overview:
      "A scenic cascade nestled in lush greenery, perfect for nature walks and refreshing photo stops.",
    highlights: ["Forest trail", "Natural pools", "Lush surroundings"],
    visiting: {
      timings: "8:00 AM – 5:00 PM",
      entryFee: "Nominal local fee",
      bestTime: "Post-monsoon",
      duration: "90–120 minutes",
    },
    tips: ["Wear trekking shoes", "Carry water and snacks"],
    gettingThere:
      "Drive towards the waterfall trailhead and continue on foot along marked paths.",
    nearby: [
      {
        id: "garud-chatti-waterfall",
        title: "Garud Chatti Waterfall",
        distance: "4.8 Km",
      },
    ],
  },
  "kailas-ashram": {
    title: "Kailas Ashram",
    desc: "Tourist Attraction",
    distance: "2.8 Km",
    category: "Local Attraction",
    images: [
      "https://i.pinimg.com/736x/08/92/ca/0892ca91b40e1691f77cabc927b8cc56.jpg",
      "https://images.unsplash.com/photo-1521417531521-3c6d336c0ed0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1519586151134-9f4759b8fbb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
    overview:
      "A serene spiritual center offering calm surroundings, meditation spaces, and traditional architecture.",
    highlights: ["Quiet courtyards", "Meditation halls"],
    visiting: {
      timings: "7:00 AM – 7:00 PM",
      entryFee: "Free",
      bestTime: "Morning",
      duration: "45–90 minutes",
    },
    tips: ["Maintain silence", "Dress modestly"],
    gettingThere: "Reachable via local transport; short walk from drop-off.",
    nearby: [{ id: "ram-jhula", title: "Ram Jhula", distance: "2.4 Km" }],
  },
  "garud-chatti-waterfall": {
    title: "Garud Chatti Waterfall",
    desc: "Multi-tiered Waterfall in Rajaji Forest",
    distance: "4.8 Km",
    category: "Local Attraction",
    images: [
      "https://i.pinimg.com/736x/73/c3/2b/73c32b0a1ed0db57a8a9070e70b3d66d.jpg",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1482192505345-5655af8886f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
    overview:
      "A picturesque multi-tiered waterfall set within Rajaji Forest, ideal for short treks and nature lovers.",
    highlights: ["Tiered cascades", "Forest ambience"],
    visiting: {
      timings: "8:00 AM – 5:00 PM",
      entryFee: "Nominal local fee",
      bestTime: "Post-monsoon",
      duration: "90–120 minutes",
    },
    tips: ["Avoid slippery rocks", "Follow marked trails"],
    gettingThere:
      "Drive towards the base and trek along forest paths to reach the falls.",
    nearby: [
      {
        id: "neergarh-waterfall",
        title: "Neergarh Waterfall",
        distance: "2.1 Km",
      },
    ],
  },
  shivpuri: {
    title: "Shivpuri",
    desc: "Adventure Hotspot of Rishikesh",
    distance: "11.4 Km",
    category: "Local Attraction",
    images: [
      "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxlLxjqjpktdeew5q1MN6xCiOBRcoaeFiXT9BREX01jAety7rGmJsPj1FlYxOI7x_O0V60qwPs3tTZ_mkUzKU11MXj7JaOo_t8ds86fnIxa0U7fozzlyZHRZLy9GGCl9IE=w1200-h800",
      "https://images.unsplash.com/photo-1526481280692-9062fd38c1ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
    overview:
      "A well-known hub for river rafting, camping, and outdoor activities along the Ganges.",
    highlights: ["Rafting stretch", "Camping spots", "River views"],
    visiting: {
      timings: "Activity dependent",
      entryFee: "Operator dependent",
      bestTime: "Oct–Jun",
      duration: "Half-day to full-day",
    },
    tips: ["Book certified operators", "Check weather and water levels"],
    gettingThere:
      "Accessible by road from Rishikesh; tour operators provide transfers.",
    nearby: [{ id: "ram-jhula", title: "Ram Jhula", distance: "2.4 Km" }],
  },
};

export default function AttractionDetail() {
  const { id } = useParams();
  const attraction = ATTRACTIONS[id];

  if (!attraction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-primary mb-4">
            Attraction Not Found
          </h2>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="relative h-[60vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={attraction.images[0]}
            alt={attraction.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 text-white">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                to="/"
                className="inline-flex items-center text-gray-300 hover:text-accent mb-6 transition-colors group"
              >
                <ArrowLeft
                  size={20}
                  className="mr-2 group-hover:-translate-x-1 transition-transform"
                />{" "}
                Back to Home
              </Link>
              <h1 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">
                {attraction.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="bg-white/90 text-primary px-3 py-1 rounded-sm font-bold uppercase tracking-widest">
                  {attraction.category}
                </span>
                {attraction.distance && (
                  <span className="bg-white/80 text-primary px-3 py-1 rounded-sm font-bold uppercase tracking-widest">
                    {attraction.distance}
                  </span>
                )}
              </div>
              <p className="text-gray-200 mt-4 text-lg">
                {attraction.overview || attraction.desc}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-serif text-primary mb-6">
                Highlights
              </h2>
              <div className="flex flex-wrap gap-3">
                {(attraction.highlights || []).map((h, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-700"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Visiting Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Timings
                  </span>
                  <p className="text-gray-700">
                    {attraction.visiting?.timings || "Varies"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Entry Fee
                  </span>
                  <p className="text-gray-700">
                    {attraction.visiting?.entryFee || "Free"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Best Time
                  </span>
                  <p className="text-gray-700">
                    {attraction.visiting?.bestTime || "Anytime"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Recommended Duration
                  </span>
                  <p className="text-gray-700">
                    {attraction.visiting?.duration || "60–90 minutes"}
                  </p>
                </div>
              </div>
              {!!(attraction.tips || []).length && (
                <div className="mt-6">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Tips
                  </span>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {attraction.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Getting There
              </h3>
              <p className="text-gray-700">{attraction.gettingThere}</p>
            </div>

            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-3xl font-serif text-primary">Gallery</h2>
                <p className="text-sm text-gray-500 italic">
                  More views of this attraction
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {attraction.images.slice(1).map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-xl overflow-hidden cursor-pointer shadow-lg group h-[260px]"
                  >
                    <img
                      src={img}
                      alt={`${attraction.title} view ${idx + 2}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Nearby Attractions
              </h3>
              <div className="space-y-4">
                {(attraction.nearby || []).map((n) => (
                  <Link
                    to={`/attractions/${n.id}`}
                    key={n.id}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                      <img
                        src={ATTRACTIONS[n.id]?.images[0]}
                        alt={n.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary group-hover:text-accent transition-colors">
                        {n.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {n.distance}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

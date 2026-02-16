import React, { useState } from "react";
import { FaTimes, FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { MdTimer } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import { motion } from "framer-motion";

const AdditionalService = () => {
  const openModal = (item) => setSelectedProduct(item);
  const closeModal = () => setSelectedProduct(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const additionalServices = [
    {
      id: "bungee-jumping",
      title: "Bungee Jumping",
      category: "Adventure Sports",
      description:
        "Experience the ultimate adrenaline rush by jumping from India’s highest bungee platform under the supervision of internationally certified instructors.",
      longDescription:
        "Bungee Jumping in Rishikesh offers an unmatched thrill where you jump from a steel cantilever platform suspended over a natural gorge. The activity is conducted by trained professionals using international safety standards. This experience is perfect for thrill-seekers looking to challenge their limits while enjoying breathtaking views of the Himalayan foothills.",
      duration: "15–20 minutes (including briefing)",
      difficulty: "High",
      ageLimit: "12 – 45 years",
      weightLimit: "35 kg – 110 kg",
      location: "Mohan Chatti, Rishikesh",
      includes: [
        "Professional safety briefing",
        "Jump from 83 meters height",
        "All safety equipment",
        "Trained jump masters",
        "Jump certificate",
      ],
      safety:
        "All equipment is imported and checked daily. The jump is supervised by experienced and licensed instructors.",
      price: 3500,
      oldPrice: 4200,
      img: "/images/bjumping.webp",
      bookingActivityId: "bungee",
    },
    {
      id: "rental-services",
      title: "Rental Service",
      category: "Local Transport",
      description:
        "Rent a well-maintained bike and explore Rishikesh at your own pace.",
      longDescription:
        "Our bike rental service gives you the freedom to travel through Rishikesh’s scenic routes, riverbanks, cafes, and temples. Choose from scooters, cruisers, or adventure bikes. All bikes are regularly serviced and include helmets and basic safety gear.",
      duration: "Flexible (Hourly / Daily)",
      difficulty: "Easy",
      ageLimit: "18+ with valid driving license",
      location: "Hotel Pickup or City Center",
      includes: [
        "Helmet",
        "Roadside assistance",
        "Basic insurance",
        "Fuel guidance",
      ],
      safety:
        "All bikes are sanitized and checked before every rental. Helmets are mandatory.",
      price: 800,
      oldPrice: 1200,
      img: "/images/bikerenting.webp",
      bookingActivityId: null,
    },

    {
      id: "river-rafting",
      title: "River Rafting",
      category: "Water Adventure",
      description:
        "Ride the thrilling rapids of the holy Ganges with expert rafting guides.",
      longDescription:
        "River Rafting in Rishikesh is one of the most exciting water sports in India. You’ll navigate through grade I to grade IV rapids while enjoying the beauty of mountains and forests. Safety kayakers and trained guides ensure a thrilling yet safe experience.",
      duration: "2–3 hours",
      difficulty: "Medium to High",
      ageLimit: "14 – 55 years",
      weightLimit: "Min 40 kg",
      location: "Shivpuri to Rishikesh",
      includes: [
        "Raft and paddle",
        "Life jacket",
        "Helmet",
        "Professional river guide",
        "Safety kayak support",
      ],
      safety:
        "International grade rafting equipment and certified river guides ensure maximum safety.",
      price: 1500,
      oldPrice: 2000,
      img: "/images/rafting.webp",
      bookingActivityId: "rafting",
    },
  ];

  return (
    <section className="bg-primary py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          {" "}
          <span className="text-accent text-xs uppercase tracking-[0.3em] font-bold block mb-4">
            {" "}
            Additional Service{" "}
          </span>{" "}
          <h2 className="text-4xl md:text-5xl font-serif text-white">
            {" "}
            Make Your Stay More Memorable{" "}
          </h2>{" "}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {additionalServices.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden shadow-xl group"
            >
              {/* Image */}
              <div className="h-[360px] relative">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Orange Label */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-accent text-white text-sm px-6 py-2 rounded-full font-medium shadow-lg">
                  {item.title}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-8 text-center">
                <p className="text-white text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                <button
                  onClick={() => openModal(item)}
                  className="text-accent text-sm font-semibold hover:translate-x-2 transition cursor-pointer"
                >
                  Click for more information →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-3 sm:px-6 py-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
        relative bg-primary rounded-2xl w-full max-w-5xl
        max-h-[90vh] overflow-hidden shadow-2xl
        animate-scaleIn
      "
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="
          absolute top-3 right-3 z-20
          bg-white rounded-full p-2 shadow
          hover:bg-accent hover:text-white transition
        "
            >
              <FaTimes />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              {/* Image */}
              <div className="relative h-[220px] sm:h-[280px] md:h-full">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div
                className="
            p-5 sm:p-8
            overflow-y-auto
            max-h-[calc(90vh-220px)]
            md:max-h-full
            text-center md:text-left
          "
              >
                <p className="uppercase text-xs tracking-widest text-white mb-2">
                  {selectedProduct.category}
                </p>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-accent">
                  {selectedProduct.title}
                </h2>

                <p className="text-white mt-3 leading-relaxed text-sm sm:text-base">
                  {selectedProduct.longDescription}
                </p>

                {/* Info */}
                <div className="mt-5 space-y-3 text-sm text-white">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <FaLocationDot className="text-accent" />
                    <span className="font-semibold">Location:</span>
                    <span>{selectedProduct.location}</span>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <MdTimer className="text-accent" />
                    <span className="font-semibold">Duration:</span>
                    <span>{selectedProduct.duration}</span>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <TbTargetArrow className="text-accent" />
                    <span className="font-semibold">Difficulty:</span>
                    <span>{selectedProduct.difficulty}</span>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <FaUser className="text-accent" />
                    <span className="font-semibold">Age Limit:</span>
                    <span>{selectedProduct.ageLimit}</span>
                  </div>
                </div>

                {/* Included */}
                <div className="mt-7">
                  <h4 className="font-semibold text-accent mb-3">
                    What’s Included
                  </h4>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white">
                    {selectedProduct.includes?.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <GoDotFill className="text-[#C9A24D]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdditionalService;

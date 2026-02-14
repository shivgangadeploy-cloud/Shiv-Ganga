import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const Testimonials = () => {
  const testimonialSwiperRef = useRef(null);

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Business Traveler",
      text: "The attention to detail at Shiv Ganga is unmatched. From the moment I arrived, I felt like royalty. The room service was impeccable.",
    },
    {
      name: "David Chen",
      role: "Tourist",
      text: "A hidden gem in Rishikesh. The view of the Ganges from the rooftop restaurant is breathtaking. Highly recommended for a peaceful stay.",
    },
    {
      name: "Elena Rodriguez",
      role: "Architect",
      text: "The interior design is a stunning blend of traditional heritage and modern luxury. Every corner is a work of art.",
    },
    {
      name: "Sarah Jenkins",
      role: "Business Traveler",
      text: "The attention to detail at Shiv Ganga is unmatched. From the moment I arrived, I felt like royalty. The room service was impeccable.",
    },
    {
      name: "David Chen",
      role: "Tourist",
      text: "A hidden gem in Rishikesh. The view of the Ganges from the rooftop restaurant is breathtaking. Highly recommended for a peaceful stay.",
    },
    {
      name: "Elena Rodriguez",
      role: "Architect",
      text: "The interior design is a stunning blend of traditional heritage and modern luxury. Every corner is a work of art.",
    },
  ];

  return (
    <section className=" bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="text-accent text-xs uppercase tracking-[0.3em] font-bold block mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary">
            Guest Stories
          </h2>
        </div>

        <div className="relative group">
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => {
              testimonialSwiperRef.current = swiper;
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-16 !pb-20"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index} className="!h-auto flex">
                <div className="bg-white p-10 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-sm border border-gray-50 relative group h-full">
                  <Quote className="absolute top-8 right-8 text-accent/20 w-12 h-12 group-hover:text-accent/40 transition-colors" />
                  <div className="flex text-accent mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-primary/80 hover:text-primary italic mb-8 font-serif text-lg leading-relaxed">
                    "{item.text}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-serif text-lg">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {item.role}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            aria-label="Previous testimonials"
            onClick={() => testimonialSwiperRef.current?.slidePrev()}
            className="flex md:flex items-center justify-center absolute left-[-18px] md:left-[-24px] top-1/2 -translate-y-[55%] z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 text-primary shadow-xl ring-1 ring-black/5 hover:bg-white transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            aria-label="Next testimonials"
            onClick={() => testimonialSwiperRef.current?.slideNext()}
            className="flex md:flex items-center justify-center absolute right-[-18px] md:right-[-24px] top-1/2 -translate-y-[55%] z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 text-primary shadow-xl ring-1 ring-black/5 hover:bg-white transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

// import React, { useRef, useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
// import { motion } from "framer-motion";
// import api from "../../api/api";

// const Testimonials = () => {
//   const testimonialSwiperRef = useRef(null);

//   const [testimonials, setTestimonials] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTestimonials = async () => {
//       try {
//         const res = await api.get("/testimonial");
//         setTestimonials(res.data.data || []);
//       } catch (err) {
//         console.error("Failed to load testimonials", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTestimonials();
//   }, []);

//   return (
//     <section className=" bg-background relative overflow-hidden">
//       <div className="container mx-auto px-6 relative z-10">
//         <div className="text-center mb-20">
//           <span className="text-accent text-xs uppercase tracking-[0.3em] font-bold block mb-4">
//             Testimonials
//           </span>
//           <h2 className="text-4xl md:text-5xl font-serif text-primary">
//             Guest Stories
//           </h2>
//         </div>

//         {/* Loading / Empty State */}
//         {loading && (
//           <p className="text-center text-gray-400">Loading testimonials...</p>
//         )}

//         {!loading && testimonials.length === 0 && (
//           <p className="text-center text-gray-400">No reviews available yet.</p>
//         )}

//         {!loading && testimonials.length > 0 && (
//           <div className="relative group">
//             <Swiper
//               modules={[Pagination]}
//               spaceBetween={30}
//               slidesPerView={1}
//               pagination={{ clickable: true }}
//               onSwiper={(swiper) => {
//                 testimonialSwiperRef.current = swiper;
//               }}
//               breakpoints={{
//                 768: {
//                   slidesPerView: 2,
//                 },
//                 1024: {
//                   slidesPerView: 3,
//                 },
//               }}
//               className="pb-16 !pb-20"
//             >
//               {testimonials.map((item, index) => (
//                 <SwiperSlide key={item._id || index} className="!h-auto flex">
//                   <div className="bg-white p-10 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-sm border border-gray-50 relative group h-full">
//                     <Quote className="absolute top-8 right-8 text-accent/20 w-12 h-12 group-hover:text-accent/40 transition-colors" />

//                     {/* Rating */}
//                     <div className="flex text-accent mb-6">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           size={14}
//                           fill={i < item.rating ? "currentColor" : "none"}
//                           className={i < item.rating ? "" : "text-gray-300"}
//                         />
//                       ))}
//                     </div>

//                     <p className="text-primary/80 hover:text-primary italic mb-8 font-serif text-lg leading-relaxed">
//                       "{item.message}"
//                     </p>

//                     <div className="flex items-center gap-4 mt-auto">
//                       <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-serif text-lg">
//                         {item.name?.charAt(0)}
//                       </div>
//                       <div>
//                         <h4 className="font-bold text-primary text-sm">
//                           {item.name}
//                         </h4>
//                         <span className="text-[10px] text-gray-400 uppercase tracking-wider">
//                           Guest
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             {/* Navigation Buttons */}
//             <button
//               aria-label="Previous testimonials"
//               onClick={() => testimonialSwiperRef.current?.slidePrev()}
//               className="flex md:flex items-center justify-center absolute left-[-18px] md:left-[-24px] top-1/2 -translate-y-[55%] z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 text-primary shadow-xl ring-1 ring-black/5 hover:bg-white transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
//             >
//               <ChevronLeft size={20} />
//             </button>

//             <button
//               aria-label="Next testimonials"
//               onClick={() => testimonialSwiperRef.current?.slideNext()}
//               className="flex md:flex items-center justify-center absolute right-[-18px] md:right-[-24px] top-1/2 -translate-y-[55%] z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 text-primary shadow-xl ring-1 ring-black/5 hover:bg-white transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Testimonials;

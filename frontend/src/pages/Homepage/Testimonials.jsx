import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ronak Raval",
    rating: 5,
    time: "1 month ago",
    review:
      "Best experience in Rishikesh at Shiv Ganga hotel. Service and room quality is good. Although need to improve washroom. Rest is good.",
  },
  {
    id: 2,
    name: "Nitin nn",
    rating: 5,
    time: "3 weeks ago",
    review:
      "Very amazing hotel in whole Rishikesh — good for all categories of stay.",
  },
  {
    id: 3,
    name: "Shyam Bisht",
    rating: 5,
    time: "1 month ago",
    review:
      "Great service by the team, especially Mr Vinod — very kind and polite. Rooms are good and services are great. Highly recommended.",
  },
  {
    id: 4,
    name: "Manish Jha",
    rating: 5,
    time: "3 weeks ago",
    review:
      "Amazing hotel and clean rooms. If you want to stay in Rishikesh, please stay and enjoy.",
  },
  {
    id: 5,
    name: "Mona Dixit",
    rating: 5,
    time: "1 month ago",
    review:
      "Very nice hotel. Santosh ji was very cooperative, especially with kids. Happy with the facilities.",
  },
  {
    id: 6,
    name: "Vijay Pratap Singh",
    rating: 5,
    time: "2 months ago",
    review:
      "Nice place, clean rooms, and affordable price. Recommended for stay in Rishikesh.",
  },
  {
    id: 7,
    name: "Krishna Kanth",
    rating: 5,
    time: "10 months ago",
    review:
      "Fantastic spacious rooms, clean washrooms, polite staff, and great value. Highly recommended.",
  },
  {
    id: 8,
    name: "Sachin",
    rating: 5,
    time: "1 month ago",
    review: "Great stay. Facilities are very well maintained.",
  },
  {
    id: 9,
    name: "Jay Kushwaha",
    rating: 5,
    time: "1 month ago",
    review:
      "Good place and location. Everything is close for food and transportation.",
  },
  {
    id: 10,
    name: "Pahadi Bhai",
    rating: 5,
    time: "1 month ago",
    review: "Neat and clean rooms. Good stay. Nearby main Tapovan road.",
  },
];

const Testimonials = () => {
  const swiperRef = useRef(null);

  return (
    <section className="bg-background relative overflow-hidden py-10">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-accent text-xs uppercase tracking-[0.3em] font-bold block mb-3">
            Testimonials
          </span>

          <h2 className="text-4xl md:text-5xl font-serif text-primary">
            Guest Stories
          </h2>
        </div>

        {/* Slider */}
        <div className="relative group">
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            pagination={{ clickable: true }}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="pb-16"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id} className="!h-auto flex">
                <div className="bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-md border border-gray-100 relative flex flex-col h-full">
                  {/* Quote icon */}
                  <Quote className="absolute top-6 right-6 text-accent/20 w-10 h-10" />

                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < item.rating
                            ? "text-accent fill-accent"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="text-primary/80 italic mb-6 leading-relaxed">
                    “{item.review}”
                  </p>

                  {/* Footer */}
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                      {item.name.charAt(0)}
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary text-sm">
                        {item.name}
                      </h4>

                      <span className="text-xs text-gray-400">{item.time}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow hover:scale-110 transition flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow hover:scale-110 transition flex items-center justify-center"
          >
            <ChevronRight size={18} />
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

import React from "react";
import {
  Bell,
  BrushCleaning,
  Cctv,
  Check,
  SquareParking,
  Wifi,
  Zap,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const Amenities = () => {
  const services = [
    {
      icon: SquareParking,
      title: "Free Parking",
      description:
        "Enjoy the convenience of complimentary parking, ensuring a hassle-free arrival and departure.",
    },
    {
      icon: Wifi,
      title: "Free WiFi",
      description:
        "Stay connected and share your memorable moments with our free Wi-Fi service throughout the resort.",
    },
    {
      icon: BrushCleaning,
      title: "Housekeeping Service",
      description:
        "Our 24-hour housekeeping service ensures consistently clean and comfortable rooms, enhancing your stay at our hotel.",
    },
    {
      icon: Zap,
      title: "24/7 Electricity",
      description:
        "Our hotel offers 24-hour electricity, ensuring continuous power and comfort for a seamless guest experience.",
    },
    {
      icon: Cctv,
      title: "CCTV Surveillance",
      description:
        "Your safety is our priority; our CCTV surveillance ensures a secure and tranquil environment.",
    },
    {
      icon: Bell,
      title: "24/7 Reception",
      description:
        "Our 24-hour reception provides round-the-clock assistance, ensuring guests' needs are met at any time.",
    },
    {
      icon: Check,
      title: "Easy Convenience",
      description:
        "Discover ultimate convenience with easy access to nearby attractions, ensuring a smooth and enjoyable experience.",
    },
  ];

  return (
    <section className="pb-20 sm:pb-24 bg-[#f8f9fb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-20">
          <span className="text-accent text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium">
            Hotel Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary mt-3">
            Our Amenities
          </h2>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          loop
          autoplay={{
            delay: 2600,
            disableOnInteraction: false,
          }}
          breakpoints={{
            360: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
          className="py-6 sm:py-10"
        >
          {services.map((item, i) => (
            <SwiperSlide key={i} className="flex justify-center">
              <div
                className="
                  flex flex-col items-center text-center
                  w-[130px] sm:w-[150px] md:w-[170px]
                  group cursor-pointer
                "
              >
                {/* Icon */}
                <div
                  className="
                    w-[80px] h-[80px]
                    sm:w-[90px] sm:h-[90px]
                    md:w-[100px] md:h-[100px]
                    rounded-2xl
                    bg-white
                    shadow-[0_12px_28px_rgba(0,0,0,0.08)]
                    flex items-center justify-center
                    transition-all duration-500
                    group-hover:bg-accent
                    group-hover:shadow-[0_20px_40px_rgba(216,119,6,0.35)]
                  "
                >
                  <item.icon
                    className="
                      w-7 h-7
                      sm:w-8 sm:h-8
                      md:w-9 md:h-9
                      text-primary
                      transition-colors
                      group-hover:text-white
                    "
                  />
                </div>

                {/* Title */}
                <p
                  className="
                    mt-6 sm:mt-8
                    text-[10px] sm:text-xs
                    uppercase tracking-widest
                    text-primary font-semibold
                    group-hover:text-accent
                    transition-colors
                  "
                >
                  {item.title}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Amenities;

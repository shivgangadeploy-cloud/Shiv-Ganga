import React, { useState } from "react";
import { motion } from "framer-motion";
import bg1 from "../../assets/homepage-images/banner-one.webp";
import { ChevronDown } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { rooms } from "../../data/rooms";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const BookingBar = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [persons, setPersons] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomCategoryId, setRoomCategoryId] = useState("");
  // const [activityPersons, setActivityPersons] = useState(0);

  const handleSearch = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    try {
      const params = {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults: persons,
        children,
      };

      // category optional
      if (roomCategoryId) {
        const selectedRoom = rooms.find((r) => String(r.id) === roomCategoryId);

        if (selectedRoom?.name) {
          params.category = selectedRoom.name;
        }
      }

      const res = await api.get("/room/search", { params });

      navigate("/booking", {
        state: {
          step: 2,
          checkIn,
          checkOut,
          adults: persons,
          children,
          rooms: res.data?.data || [],
        },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to search rooms");
    }
  };

  return (
    <div className="relative z-30 -mt-20 sm:-mt-24 container mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="
          relative overflow-hidden
          rounded-2xl
          shadow-2xl
          border border-white/20
          backdrop-blur-xl
        "
      >
        <div className="absolute inset-0 bg-primary"></div>

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg1})` }}
        />

        <div className="absolute inset-0 bg-primary/80 "></div>

        <div className="relative z-10 p-6 md:p-12">
          <div className="grid md:grid-cols-5 gap-6 md:gap-8 items-end">
            {/* DATE */}
            {/* {[
              { label: "Check In", value: checkIn, set: setCheckIn },
              { label: "Check Out", value: checkOut, set: setCheckOut },
            ].map((f, i) => (
              <div key={i} className="relative group">
                <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-2 group-focus-within:text-accent transition">
                  {f.label}
                </label>
                <input
                  type="date"
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className="w-full bg-transparent border-b border-white/30 py-3 text-white text-xl font-serif focus:border-accent outline-none transition cursor-pointer placeholder-white/50"
                />
              </div>
            ))} */}

            {/* ROOM CATEGORY */}
            <div className="relative group">
              <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-2 group-focus-within:text-accent transition">
                Check In
              </label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  // reset checkout if earlier
                  if (checkOut && e.target.value > checkOut) {
                    setCheckOut("");
                  }
                }}
                style={{ colorScheme: "dark" }}
                className="
                  w-full bg-transparent
                  border-b border-white/30
                  py-2 sm:py-3
                  text-lg sm:text-xl
                  font-serif
                  text-white
                  focus:border-accent
                  outline-none
                  transition
                  cursor-pointer
                "
              />
            </div>

            {/* CHECK OUT */}
            <div className="relative group">
              <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-2 group-focus-within:text-accent transition">
                Check Out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="
                  w-full bg-transparent
                  border-b border-white/30
                  py-2 sm:py-3
                  text-lg sm:text-xl
                  font-serif
                  text-white
                  focus:border-accent
                  outline-none
                  transition
                  cursor-pointer
                "
              />
            </div>

            {/* PERSONS */}
            <div className="relative group">
              <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-2 group-focus-within:text-accent transition">
                Persons
              </label>
              <div className="relative">
               <input
  type="number"
  min={1}
  value={persons}
  onChange={(e) => setPersons(Number(e.target.value))}
  placeholder="No. of persons"
  className="
    w-full
    bg-transparent
    border-b border-white/30
    py-2 sm:py-3
    text-lg sm:text-xl
    font-serif
    text-white
    focus:border-accent
    outline-none
    transition
  "
/>
                {/* <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" /> */}
              </div>
            </div>

            {/* CHILDREN */}
            <div className="relative group">
              <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-2 group-focus-within:text-accent transition">
                Children
              </label>
              <div className="relative">
                <input
  type="number"
  min={0}
  value={children}
  onChange={(e) => setChildren(Number(e.target.value))}
  placeholder="No. of children"
  className="
    w-full
    bg-transparent
    border-b border-white/30
    py-2 sm:py-3
    text-xl sm:text-2xl
    font-serif
    text-white
    focus:border-accent
    outline-none
    transition
  "
/>
                {/* <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" /> */}
              </div>
            </div>

            {/* ACTIVITY PERSONS */}
            {/* <div className="relative group">
              <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-2 group-focus-within:text-accent transition">
                Activity Persons
              </label>
              <div className="relative">
                <select
                  value={activityPersons}
                  onChange={(e) => setActivityPersons(Number(e.target.value))}
                  className="
                    w-full appearance-none
                    bg-transparent
                    border-b border-white/30
                    py-2 sm:py-3
                    text-lg sm:text-xl
                    font-serif
                    text-white
                    focus:border-accent
                    outline-none
                    transition
                    cursor-pointer
                    pr-8
                  "
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n} className="bg-primary text-white">
                      {n} Person{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
              </div>
            </div> */}

            {/* SEARCH BUTTON */}
            <button
              type="button"
              onClick={handleSearch} // ✅ ONLY CHANGE
              className="h-[60px] w-full flex items-center justify-center
                bg-white text-accent rounded-2xl
                font-bold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer hover:bg-accent hover:text-white"
            >
              <FaSearch className="text-xl sm:text-2xl" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingBar;

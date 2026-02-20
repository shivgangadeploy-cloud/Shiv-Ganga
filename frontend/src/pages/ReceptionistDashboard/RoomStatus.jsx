import React, { useState, useEffect } from "react";
import {
  User,
  SprayCan,
  Wrench,
  CheckCircle2,
  MoreHorizontal,
  AlertCircle,
  Droplets,
  ArrowRight,
  BedDouble,
  Search,
  Calendar,
} from "lucide-react";
import Sidebar from "./Sidebar";
import api from "../axios"; // Path to your axios.js

const RoomStatus = () => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // CHANGED: Initialized with empty array and added loading state
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRITICAL: View rooms for a specific date
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // NEW: Fetch function to connect to your room.controller.js
  const fetchRooms = async () => {
    setLoading(true);

    try {
      const { data } = await api.get(`/room?date=${selectedDate}`);

      console.log(data.data);

      const mappedData = data?.data?.map((room) => ({
        id: room?._id,
        displayId: room?.roomNumber,
        mongoId: room?._id,

        type: room?.type ?? room?.name ?? "Room",
        price: room?.pricePerNight ?? 0,

        // ✅ Backend controls status
        status: room?.derivedStatus ?? "Available",

        guest: room?.activeBooking?.guestName ?? null,
        bookingId: room?.activeBooking ?? null,

        checkInDate: room?.activeBooking?.checkInDate ?? null,
        checkOutDate: room?.activeBooking?.checkOutDate ?? null,

        issue: room?.issue ?? "General Maintenance",
      })) ?? [];

      setRooms(mappedData);

    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, [selectedDate]); // Re-fetch when date changes

  const handleCheckIn = async (roomMongoId) => {
    try {
      await api.patch(`/room/${roomMongoId}/check-in`);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Check-In failed");
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleCheckOut = async (roomMongoId) => {
    try {
      await api.patch(`/room/${roomMongoId}/check-out`);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Check-Out failed");
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleMaintenance = async (roomMongoId, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "Maintenance" ? "Available" : "Maintenance";

      await api.put(`/room/${roomMongoId}`, { status: newStatus });
      await fetchRooms();
    } catch (err) {
      alert("Failed to update maintenance status");
    } finally {
      setOpenMenuId(null);
    }
  };

  // UPDATED: Now sends update to backend
  //   const handleStatusChange = async (roomId, newStatus) => {
  //   const roomToUpdate = rooms.find(r => r.id === roomId);
  //   if (!roomToUpdate) return;

  //   try {
  //     await api.put(`/room/${roomToUpdate.mongoId}`, {
  //       status: newStatus
  //     });

  //     setRooms(prev =>
  //       prev.map(room =>
  //         room.displayId === roomId
  //           ? {
  //               ...room,
  //               status: newStatus,
  //               housekeeping: newStatus === "Dirty" ? "Dirty" : "Clean",
  //               issue: newStatus === "Maintenance" ? "Under Repair" : null,
  //               guest:
  //                 newStatus === "Available" || newStatus === "Maintenance"
  //                   ? null
  //                   : room.guest
  //             }
  //           : room
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Update failed:", error);
  //   } finally {
  //     setOpenMenuId(null);
  //   }
  // };

  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (!e.target.closest('.room-menu-trigger') && !e.target.closest('.room-menu-content')) {
  //       setOpenMenuId(null);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // const filteredRooms = rooms.filter(room => {
  //   const matchesFilter = filterStatus === 'All' ||
  //                         (filterStatus === 'Available' && room.status === 'Available') ||
  //                         (filterStatus === 'Occupied' && room.status === 'Occupied') ||
  //                         (filterStatus === 'Dirty' && room.status === 'Dirty') ||
  //                         (filterStatus === 'Maintenance' && room.status === 'Maintenance');

  //   const matchesSearch = room.displayId.toString().includes(searchQuery) ||
  //                         (room.guest && room.guest.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //                         room.type.toLowerCase().includes(searchQuery.toLowerCase());

  //   return matchesFilter && matchesSearch;
  // });

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".room-menu-trigger") &&
        !e.target.closest(".room-menu-content")
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesFilter =
      filterStatus === "All" || room.status === filterStatus;
    const matchesSearch =
      room.displayId.toString().includes(searchQuery) ||
      (room.guest &&
        room.guest.toLowerCase().includes(searchQuery.toLowerCase())) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case "Available":
        return {
          badgeBg: "bg-emerald-50",
          badgeText: "text-emerald-700",
          badgeBorder: "border-emerald-100",
          icon: <CheckCircle2 size={14} />,
        };

      case "Booked":
        return {
          badgeBg: "bg-amber-50",
          badgeText: "text-amber-700",
          badgeBorder: "border-amber-100",
          icon: <Calendar size={14} />,
        };

      case "Occupied":
        return {
          badgeBg: "bg-rose-50",
          badgeText: "text-rose-700",
          badgeBorder: "border-rose-100",
          icon: <User size={14} />,
        };

      case "Maintenance":
        return {
          badgeBg: "bg-slate-50",
          badgeText: "text-slate-600",
          badgeBorder: "border-slate-200",
          icon: <Wrench size={14} />,
        };

      default:
        return {
          badgeBg: "bg-gray-50",
          badgeText: "text-gray-600",
          icon: <AlertCircle size={14} />,
        };
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        Connecting to Server...
      </div>
    );

  return (
    <Sidebar>
      <div className="flex flex-col gap-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a]">
              Room Records
            </h1>
            <p className="text-slate-500">
              Managing inventory for {new Date(selectedDate).toDateString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Date Picker */}
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
              />
            </div>
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatusCard
            label="Total Rooms"
            value={rooms.length}
            icon={<BedDouble size={20} />}
            active
          />
          <StatusCard
            label="Occupied"
            value={rooms.filter((r) => r.status === "Occupied").length}
            icon={<User size={20} />}
            color="text-rose-600"
          />
          <StatusCard
            label="Available"
            value={rooms.filter((r) => r.status === "Available").length}
            icon={<CheckCircle2 size={20} />}
            color="text-emerald-600"
          />
          <StatusCard
            label="Booked"
            value={rooms.filter((r) => r.status === "Booked").length}
            icon={<Calendar size={20} />}
            color="text-amber-600"
          />

          <StatusCard
            label="Maintenance"
            value={rooms.filter((r) => r.status === "Maintenance").length}
            icon={<Wrench size={20} />}
            color="text-slate-600"
          />
        </div>

        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full md:w-fit overflow-x-auto custom-scrollbar no-scrollbar">
          <div className="flex gap-1 min-w-max">
            {["All", "Available", "Booked", "Occupied", "Maintenance"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`
                  px-5 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide
                  ${filterStatus === status
                      ? "bg-[#0f172a] text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#0f172a]"
                    }
                `}
                >
                  {status}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => {
              const config = getStatusConfig(room.status);

              return (
                <div
                  key={room.displayId}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#D4AF37]/30 transition-all duration-300 group flex flex-col justify-between relative"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4 relative">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col leading-tight">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Room
                          </p>

                          <p className="text-2xl font-extrabold text-[#0f172a]">
                            {room.displayId}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {room.type}
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === room.displayId
                                ? null
                                : room.displayId,
                            );
                          }}
                          className="text-slate-300 hover:text-[#0f172a] transition-colors p-1 hover:bg-slate-50 rounded-lg room-menu-trigger"
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {openMenuId === room.displayId && (
                          <div className="absolute right-0 top-8 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in zoom-in-95 duration-200 room-menu-content">

                            <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Actions
                            </p>

                            {/* CHECK IN */}
                            <button
                              disabled={room.status !== "Booked"}
                              onClick={() => handleCheckIn(room.mongoId)}
                              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all
      ${room.status !== "Booked"
                                  ? "text-gray-400 cursor-not-allowed bg-gray-50"
                                  : "text-emerald-600 hover:bg-emerald-50 active:scale-[0.98]"
                                }`}
                            >
                              ✅ Check-In
                            </button>

                            {/* CHECK OUT */}
                            <button
                              onClick={() => handleCheckOut(room.mongoId)}
                              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all
      ${room.status !== "Occupied"
                                  ? "text-gray-400 bg-gray-50"
                                  : "text-rose-600 hover:bg-rose-50 active:scale-[0.98]"
                                }`}
                            >
                              🚪 Check-Out
                            </button>

                            {/* MAINTENANCE */}
                            <button
                              onClick={() =>
                                handleMaintenance(room.mongoId, room.status)
                              }
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 active:scale-[0.98] transition-all"
                            >
                              🛠 Maintenance
                            </button>

                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}
                      >
                        {config.icon}
                        {room.status}
                      </span>

                      {/* {room.housekeeping === 'Dirty' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-200">
                            <Droplets size={12} /> Dirty
                        </span>
                      )} */}
                    </div>

                    <div className="min-h-[50px]">
                      {room.status === "Occupied" || room.status === "Booked" ? (
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                            {room.guest ? (
                              room.guest.charAt(0)
                            ) : (
                              <User size={14} />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[#0f172a] leading-tight">
                              {room.guest || "Reserved Guest"}
                            </p>
                            {/* ⭐ ADD BOOKING DATES */}
                            {room.checkInDate && room.checkOutDate && (
                              <p className="text-[10px] text-slate-400 font-medium">
                                {new Date(room.checkInDate).toLocaleDateString()} →{" "}
                                {new Date(room.checkOutDate).toLocaleDateString()}
                              </p>
                            )}

                            <p className="text-[10px] text-slate-400 font-medium">
                              {room.status === "Occupied" ? "Currently Stayed" : "Upcoming Booking"}
                            </p>
                          </div>
                        </div>
                      ) : room.status === "Maintenance" ? (
                        <div className="flex items-start gap-2 text-slate-500">
                          <AlertCircle size={16} className="mt-0.5 shrink-0" />
                          <p className="text-xs font-medium leading-tight">
                            {room.issue || "Under Repair"}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-emerald-400"></span>
                          Ready for assignment
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div>
                      <span className="text-sm font-bold text-[#0f172a]">
                        ₹{room.price}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        /night
                      </span>
                    </div>
                    {/* <button className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all shadow-sm">
                      <ArrowRight size={16} />
                    </button> */}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-slate-400 font-medium text-lg">
                No rooms found matching your search.
              </p>
            </div>
          )}
        </div>

        <div className="h-40 w-full md:hidden shrink-0"></div>
      </div>
    </Sidebar>
  );
};

const StatusCard = ({
  label,
  value,
  icon,
  active,
  color = "text-[#0f172a]",
}) => (
  <div
    className={`p-5 rounded-2xl flex items-center justify-between border shadow-sm transition-all cursor-default ${active ? "bg-[#0f172a] border-[#0f172a] text-white" : "bg-white border-slate-100 text-slate-800"}`}
  >
    <div>
      <p className="text-3xl font-black mb-1 leading-none">{value}</p>
      <p
        className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-slate-400" : "text-slate-400"}`}
      >
        {label}
      </p>
    </div>
    <div
      className={`p-3 rounded-xl ${active ? "bg-white/10 text-white" : "bg-slate-50 " + color}`}
    >
      {icon}
    </div>
  </div>
);

export default RoomStatus;

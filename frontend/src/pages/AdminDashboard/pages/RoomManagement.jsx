import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { rooms as initialRooms } from "../../../data/rooms";
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  BedDouble,
  Search,
  X,
} from "lucide-react";
import api from "../../axios";

/* ---------------- SAFE PRICE HELPER ---------------- */
const getRoomPrice = (room) => {
  if (room?.priceDetails?.ep) return room.priceDetails.ep;
  if (typeof room?.price === "number") return room.price;
  if (typeof room?.price === "string") {
    return Number(room.price.replace(/[^0-9]/g, ""));
  }
  return 0;
};

export default function RoomManagement() {
  // Backend only supports these 4 types
  const ROOM_TYPE_MAP = {
    Standard: "Standard",
    Deluxe: "Deluxe",

    Suite: "Family", // Map Suite → Family for backend
    Premium: "Deluxe", // Map Premium → Deluxe for backend
    Triple: "Triple",
    Family: "Family",
  };

  // Frontend display types (only show backend-supported types)
  const FRONTEND_TYPES = ["Standard", "Deluxe", "Family", "Triple"];

  const inferType = (name) => {
    if (/suite|family/i.test(name)) return "Family";
    if (/deluxe|premium|river|penthouse/i.test(name)) return "Deluxe";
    if (/triple/i.test(name)) return "Triple";
    if (/single|standard/i.test(name)) return "Standard";
    return "Standard";
  };

  const inferCategory = (name, type) => {
    const n = String(name || "").toLowerCase();
    const t = String(type || "").toLowerCase();

    if (/triple/.test(n) || /triple/.test(t)) return "Exclusive Triple";
    if (/family/.test(n) || /family/.test(t)) return "Grand Family Suite";
    if (/deluxe|premium|river/.test(n) || /deluxe/.test(t))
      return "Deluxe River View Room";
    if (/single|standard/.test(n) || /standard/.test(t))
      return "Single AC Room";
    return "Single AC Room";
  };

  const generateRoomNumber = () =>
    "RM-" +
    Math.floor(Date.now() % 1000000)
      .toString()
      .padStart(6, "0");

  const defaultRoomSize = (capacity) => {
    const c = Number(capacity) || 2;
    return `${250 + c * 50} sq ft`;
  };

  const statusList = ["Available", "Occupied", "Maintenance"];

  const [rooms, setRooms] = useState([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    capacityAdults: "2",
    capacityChildren: "0",
    amenities: [],
    image: null,
    type: "Standard",
    status: "Available",
    description: "",
    gallery: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/room", { headers });
        const list = (data?.data || []).map((r, idx) => {
          const ep =
            typeof r.pricePerNight === "number"
              ? r.pricePerNight
              : Number(String(r.pricePerNight || "").replace(/[^0-9]/g, "")) ||
                0;
          return {
            id: r._id,
            name: r.name,
            price: ep,
            priceDetails: {
              ep,
              cp: ep + 300,
            },

            // ✅ KEEP BOTH
            capacityAdults: r.capacityAdults ?? 2,
            capacityChildren: r.capacityChildren ?? 0,

            // ✅ FOR DISPLAY ONLY
            capacity: (r.capacityAdults ?? 2) + (r.capacityChildren ?? 0),

            amenities: r.features || [],
            image: r.mainImage || initialRooms[0]?.image,
            type: r.type || inferType(r.name),
            status: r.status || statusList[idx % statusList.length],
            description: r.description || "",
          };
        });
        setRooms(list);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
        setError("Failed to load rooms");
        setLoading(false);
        setRooms(
          initialRooms
            .filter((r) => FRONTEND_TYPES.includes(r.type || inferType(r.name)))
            .map((r, idx) => ({
              ...r,
              type: r.type || inferType(r.name),
              status: r.status || statusList[idx % statusList.length],
              priceDetails: r.priceDetails ?? {
                ep:
                  typeof r.price === "number"
                    ? r.price
                    : Number(String(r.price || "").replace(/[^0-9]/g, "")) || 0,
                cp:
                  (typeof r.price === "number"
                    ? r.price
                    : Number(String(r.price || "").replace(/[^0-9]/g, "")) ||
                      0) + 300,
              },
            })),
        );
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/room", { headers });
        const list = (data?.data || []).map((r, idx) => {
          const ep =
            typeof r.pricePerNight === "number"
              ? r.pricePerNight
              : Number(String(r.pricePerNight || "").replace(/[^0-9]/g, "")) ||
                0;
          return {
            id: r._id,
            name: r.name,
            price: ep,
            priceDetails: {
              ep,
              cp: ep + 300,
            },
            capacity: (r.capacityAdults || 0) + (r.capacityChildren || 0) || 2,
            amenities: r.features || [],
            image: r.mainImage || initialRooms[0]?.image,
            type: r.type || inferType(r.name),
            status: r.status || statusList[idx % statusList.length],
            description: r.description || "",
          };
        });
        setRooms(list);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
        setError("Failed to load rooms");
        setLoading(false);
        setRooms(
          initialRooms
            .filter((r) => FRONTEND_TYPES.includes(r.type || inferType(r.name)))
            .map((r, idx) => ({
              ...r,
              type: r.type || inferType(r.name),
              status: r.status || statusList[idx % statusList.length],
              priceDetails: r.priceDetails ?? {
                ep:
                  typeof r.price === "number"
                    ? r.price
                    : Number(String(r.price || "").replace(/[^0-9]/g, "")) || 0,
                cp:
                  (typeof r.price === "number"
                    ? r.price
                    : Number(String(r.price || "").replace(/[^0-9]/g, "")) ||
                      0) + 300,
              },
            })),
        );
      }
    };

    fetchRooms();
  }, []);

  const amenityIcon = (name) => {
    return null;
  };

  const filteredRooms = rooms
    .filter((r) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const text =
        `${r.name} ${r.type} ${(r.amenities || []).join(" ")}`.toLowerCase();
      return text.includes(q);
    })
    .filter((r) => (typeFilter === "All" ? true : r.type === typeFilter))
    .filter((r) => (statusFilter === "All" ? true : r.status === statusFilter));

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / pageSize));
  const start = (page - 1) * pageSize;
  const currentRooms = filteredRooms.slice(start, start + pageSize);

  const onChangePage = (next) => {
    setPage((p) => {
      const n = Math.min(Math.max(1, p + next), totalPages);
      return n;
    });
  };

  /* ---------------- CREATE ---------------- */
  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      price: "",
      capacityAdults: 2,
      capacityChildren: 0,

      amenities: [],
      image: null,
      gallery: [],
      type: "Standard",
      status: "Available",
      description: "",
    });
    setOpen(true);
  };

  /* ---------------- EDIT ---------------- */
  const openEdit = (room) => {
    setEditing(room.id);
    setForm({
      name: room.name || "",
      price: getRoomPrice(room),
      capacityAdults: room.capacityAdults ?? 2,
      capacityChildren: room.capacityChildren ?? 0,

      amenities: room.amenities ?? [],
      image: room.image ?? null,
      gallery: [],
      type: room.type ?? "Standard",
      status: room.status ?? "Available",
      description: room.description || "",
    });
    setOpen(true);
  };

  /* ---------------- SAVE ---------------- */
  /* ---------------- SAVE ---------------- */
  /* ---------------- SAVE ---------------- */
  const save = async () => {
    // Calculate priceNum FIRST
    const priceNum = Number(form.price) || 0;

    // Add validation
    if (!form.name.trim()) {
      alert("Room name is required");
      return;
    }

    if (priceNum <= 0) {
      alert("Valid price is required");
      return;
    }

    if (!editing && !form.image) {
      // Only require image for creation
      alert("Main image is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (editing) {
        // Check if we're uploading new files
        const hasNewImage = form.image && typeof form.image === "object";
        const hasNewGallery =
          form.gallery &&
          form.gallery.length > 0 &&
          form.gallery[0] &&
          typeof form.gallery[0] === "object";

        if (hasNewImage || hasNewGallery) {
          // Use FormData if uploading files
          const fd = new FormData();
          fd.append("name", form.name);
          fd.append("type", ROOM_TYPE_MAP[form.type] || "Standard");
          fd.append("category", inferCategory(form.name, form.type));
          fd.append("status", form.status);
          fd.append("pricePerNight", String(priceNum));
          fd.append("capacityAdults", String(Number(form.capacityAdults) || 2));
          fd.append(
            "capacityChildren",
            String(Number(form.capacityChildren) || 0),
          );

          fd.append("roomSize", defaultRoomSize(form.capacity));
          fd.append("description", form.description || "");

          (form.amenities || []).forEach((f) => fd.append("features", f));

          if (hasNewImage) {
            fd.append("mainImage", form.image);
          }

          if (hasNewGallery) {
            form.gallery.forEach((file) => {
              if (file && typeof file === "object") {
                fd.append("gallery", file);
              }
            });
          }

          const { data } = await api.put(`/room/${editing}`, fd, {
            headers: {
              ...headers,
              "Content-Type": "multipart/form-data",
            },
          });

          if (data?.data?._id) {
            const r = data.data;
            const updated = {
              id: r._id,
              name: r.name,
              price: r.pricePerNight || priceNum,
              priceDetails: {
                ep: r.pricePerNight || priceNum,
                cp: (r.pricePerNight || priceNum) + 300,
              },
              capacity:
                (r.capacityAdults || 2) + (r.capacityChildren || 0) || 2,
              amenities: r.features || [],
              image: r.mainImage || form.image,
              type: r.type || form.type,
              status: r.status || form.status,
              description: r.description || "",
            };
            setRooms((list) =>
              list.map((x) => (x.id === editing ? updated : x)),
            );
          }
        } else {
          // Use JSON if no new files
          const payload = {
            name: form.name,
            type: ROOM_TYPE_MAP[form.type] || "Standard",
            category: inferCategory(form.name, form.type),
            status: form.status,
            pricePerNight: priceNum,
            capacityAdults: Number(form.capacityAdults) || 2,
            capacityChildren: Number(form.capacityChildren) || 0,

            roomSize: defaultRoomSize(
              Number(form.capacityAdults) + Number(form.capacityChildren),
            ),

            description: form.description || "",
            features: form.amenities || [],
          };

          const { data } = await api.put(`/room/${editing}`, payload, {
            headers: { ...headers },
          });

          if (data?.data?._id) {
            const r = data.data;
            const updated = {
              id: r._id,
              name: r.name,
              price: r.pricePerNight || priceNum,
              priceDetails: {
                ep: r.pricePerNight || priceNum,
                cp: (r.pricePerNight || priceNum) + 300,
              },
              capacity:
                (r.capacityAdults || 0) + (r.capacityChildren || 0) || 2,
              amenities: r.features || [],
              image: r.mainImage || form.image,
              type: r.type || form.type,
              status: r.status || form.status,
              description: r.description || "",
            };
            setRooms((list) =>
              list.map((x) => (x.id === editing ? updated : x)),
            );
          }
        }
      } else {
        // CREATE - always use FormData
        const fd = new FormData();
        fd.append("roomNumber", generateRoomNumber());
        fd.append("name", form.name);

        const backendType = ROOM_TYPE_MAP[form.type] || "Standard";
        fd.append("type", backendType);
        fd.append("category", inferCategory(form.name, backendType));

        fd.append("description", form.description || "");
        fd.append("status", form.status);
        fd.append("pricePerNight", String(priceNum));
        fd.append(
          "roomSize",
          defaultRoomSize(
            Number(form.capacityAdults) + Number(form.capacityChildren),
          ),
        );

        fd.append("capacityAdults", String(Number(form.capacityAdults) || 2));

        fd.append(
          "capacityChildren",
          String(Number(form.capacityChildren) || 0),
        );

        // Add features
        (form.amenities || []).forEach((f) => fd.append("features", f));

        // Add main image (required for creation)
        if (form.image && typeof form.image === "object") {
          fd.append("mainImage", form.image);
        }

        // Add gallery images
        (form.gallery || []).forEach((file, index) => {
          if (file && typeof file === "object") {
            fd.append("gallery", file);
          }
        });

        const { data } = await api.post("/room", fd, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        });

        if (data?.data?._id) {
          const r = data.data;
          const created = {
            id: r._id,
            name: r.name,
            price: r.pricePerNight || priceNum,
            priceDetails: {
              ep: r.pricePerNight || priceNum,
              cp: (r.pricePerNight || priceNum) + 300,
            },
            capacity: (r.capacityAdults || 0) + (r.capacityChildren || 0) || 2,
            amenities: r.features || [],
            image: r.mainImage || initialRooms[0]?.image,
            type: r.type || form.type,
            status: r.status || form.status,
            description: r.description || "New room",
          };
          setRooms((list) => [created, ...list]);
        }
      }
      setOpen(false);
    } catch (err) {
      console.error("Save room failed", err);
      const errorMsg = err.response?.data?.message || "Failed to save room";
      alert(errorMsg);
    }
  };
  /* ---------------- DELETE ---------------- */
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.delete(`/room/${id}`, { headers });
      setRooms((list) => list.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete room failed", err);
      alert("Failed to delete room");
    }
  };

  const handleFileChange = (key, files) => {
    if (key === "image") {
      setForm((f) => ({ ...f, image: files[0] }));
    } else if (key.startsWith("gallery")) {
      setForm((f) => ({
        ...f,
        gallery: [...(f.gallery || []), files[0]],
      }));
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BedDouble />
          <div className="text-sm font-bold uppercase tracking-widest text-gray-600">
            Room Management
          </div>
          <div className="h-[1px] w-8 bg-accent"></div>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary px-4 py-2 text-xs flex items-center gap-2 rounded-2xl"
        >
          <Plus size={14} /> Add Room
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl">
        <div className="p-4 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px] flex items-center gap-2 border border-gray-300 rounded-2xl px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search rooms, amenities"
              className="flex-1 text-sm outline-none"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-gray-300 rounded-2xl px-3 py-2"
          >
            <option>All</option>

            {FRONTEND_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-gray-300 rounded-2xl px-3 py-2"
          >
            <option>All</option>
            <option>Available</option>
            <option>Booked</option>
            <option>Occupied</option>
            <option>Maintenance</option>
          </select>
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-[900px] w-full border-t border-gray-200">
            <thead className="bg-primary/5">
              <tr>
                <th className="text-left text-xs uppercase tracking-widest text-gray-500 px-4 py-3">
                  Room
                </th>
                <th className="text-left text-xs uppercase tracking-widest text-gray-500 px-4 py-3">
                  Type
                </th>
                <th className="text-left text-xs uppercase tracking-widest text-gray-500 px-4 py-3">
                  Price
                </th>
                <th className="text-left text-xs uppercase tracking-widest text-gray-500 px-4 py-3">
                  Amenities
                </th>
                <th className="text-left text-xs uppercase tracking-widest text-gray-500 px-4 py-3">
                  Status
                </th>
                <th className="text-right text-xs uppercase tracking-widest text-gray-500 px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRooms.map((room) => {
                const IconList = (room.amenities || [])
                  .map(amenityIcon)
                  .filter(Boolean)
                  .slice(0, 5);
                const statusClass =
                  room.status === "Available"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : room.status === "Occupied"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                      : room.status === "Booked"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-red-100 text-red-700 border-red-200";
                return (
                  <tr key={room.id} className="border-t border-gray-200">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-primary">
                            {room.name}
                          </div>
                          <div className="text-[11px] text-gray-500 uppercase tracking-widest">
                            {room.capacity} Guests
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-700">{room.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-accent">
                        ₹ {getRoomPrice(room)}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        CP: ₹ {(getRoomPrice(room) || 0) + 300}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {IconList.length > 0
                          ? IconList.map((I, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary"
                              >
                                <I size={14} />
                              </span>
                            ))
                          : (room.amenities || []).slice(0, 4).map((a, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] uppercase tracking-wider px-3 py-1 border border-gray-300 rounded-2xl"
                              >
                                {a}
                              </span>
                            ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] px-2 py-1 border rounded-2xl ${statusClass}`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(room)}
                          className="px-3 py-2 text-xs border border-gray-300 rounded-2xl hover:bg-primary hover:text-white cursor-pointer"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => remove(room.id)}
                          className="px-3 py-2 text-xs border border-gray-300 rounded-2xl hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {currentRooms.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No rooms found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="sm:hidden bg-gray-50/50 p-4 space-y-3 border-t border-gray-200">
          {currentRooms.map((room) => {
            const IconList = (room.amenities || [])
              .map(amenityIcon)
              .filter(Boolean)
              .slice(0, 5);
            const statusClass =
              room.status === "Available"
                ? "bg-green-100 text-green-700 border-green-200"
                : room.status === "Occupied"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                  : room.status === "Booked"
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-red-100 text-red-700 border-red-200";

            return (
              <div
                key={room.id}
                className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-3"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-800 text-sm">
                        {room.name}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                        {room.type} • {room.capacity} Guests
                      </div>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 border rounded-full uppercase tracking-wider ${statusClass}`}
                    >
                      {room.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center gap-1">
                      {IconList.length > 0
                        ? IconList.map((I, idx) => (
                            <span
                              key={idx}
                              className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center"
                            >
                              <I size={10} />
                            </span>
                          ))
                        : null}
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div className="font-bold text-accent text-sm">
                        ₹ {getRoomPrice(room)}
                      </div>
                      <button
                        onClick={() => openEdit(room)}
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangePage(-1)}
              className="px-3 py-2 text-xs border border-gray-300 rounded-2xl disabled:opacity-50 hover:bg-primary hover:text-white"
              disabled={page <= 1}
            >
              Prev
            </button>
            <button
              onClick={() => onChangePage(1)}
              className="px-3 py-2 text-xs border border-gray-300 rounded-2xl disabled:opacity-50 hover:bg-primary hover:text-white"
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
        >
          <Motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="
        bg-white 
        w-full 
        max-w-2xl 
        rounded-2xl 
        border 
        shadow-xl
        p-6
        max-h-[90vh]
        overflow-y-auto
      "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                {editing ? "Edit Room" : "Add Room"}
              </h3>

              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-red-500 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NAME */}
              <div className="md:col-span-2">
                <label className="text-xs text-gray-500">Room Name *</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="
              w-full mt-1 px-3 py-2 text-sm
              border border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-primary/30
            "
                  required
                />
              </div>

              {/* TYPE */}
              <div>
                <label className="text-xs text-gray-500">Room Type *</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                  className="
              w-full mt-1 px-3 py-2 text-sm
              border border-gray-200 rounded-xl
              bg-white
            "
                >
                  {FRONTEND_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE */}
              <div>
                <label className="text-xs text-gray-500">Price (EP) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="
              w-full mt-1 px-3 py-2 text-sm
              border border-gray-200 rounded-xl
            "
                  required
                  min="1"
                />
              </div>

              {/* CAPACITY */}
              {/* ADULTS */}
              <div>
                <label className="text-xs text-gray-500">Adults *</label>
                <input
                  type="number"
                  min="1"
                  value={form.capacityAdults}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, capacityAdults: e.target.value }))
                  }
                  className="
      w-full mt-1 px-3 py-2 text-sm
      border border-gray-200 rounded-xl
    "
                />
              </div>

              {/* CHILDREN */}
              <div>
                <label className="text-xs text-gray-500">Children</label>
                <input
                  type="number"
                  min="0"
                  value={form.capacityChildren}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, capacityChildren: e.target.value }))
                  }
                  className="
      w-full mt-1 px-3 py-2 text-sm
      border border-gray-200 rounded-xl
    "
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="text-xs text-gray-500">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="
              w-full mt-1 px-3 py-2 text-sm
              border border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-primary/30
              resize-none
              h-24
            "
                  placeholder="Room description..."
                />
              </div>

              {/* ================= AMENITIES ================= */}
              <div className="md:col-span-2">
                <label className="text-xs text-gray-500 block mb-2">
                  Amenities
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "WiFi",
                    "AC",
                    "TV",
                    "Mini Bar",
                    "Balcony",
                    "Room Service",
                    "Bathtub",
                    "Sea View",
                    "Breakfast",
                    "Parking",
                    "Pool Access",
                    "Spa",
                  ].map((item) => (
                    <label
                      key={item}
                      className="
                  flex items-center gap-2
                  border border-gray-200 rounded-xl
                  px-3 py-2 text-sm
                  cursor-pointer
                  hover:border-primary
                  transition
                "
                    >
                      <input
                        type="checkbox"
                        checked={form.amenities.includes(item)}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            amenities: e.target.checked
                              ? [...f.amenities, item]
                              : f.amenities.filter((x) => x !== item),
                          }))
                        }
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              {/* ================= MAIN IMAGE ================= */}
              <div className="md:col-span-2">
                <label className="text-xs text-gray-500">Main Image *</label>
                <label
                  className="
                mt-1 flex items-center justify-between gap-3
                border border-gray-200 rounded-xl
                px-3 py-2 text-sm
                cursor-pointer
                hover:bg-gray-50
                transition
              "
                >
                  <span className="truncate text-gray-500">
                    {form.image?.name ||
                      (typeof form.image === "string"
                        ? form.image.split("/").pop()
                        : "Choose main image...")}
                  </span>
                  <div className="flex items-center gap-2 text-gray-500">
                    <ImageIcon size={16} />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleFileChange("image", e.target.files)}
                  />
                </label>
              </div>

              {/* ================= GALLERY IMAGES ================= */}
              {[1, 2, 3].map((num) => (
                <div key={`gallery${num}`} className="md:col-span-2">
                  <label className="text-xs text-gray-500">
                    Gallery Image {num} (Optional)
                  </label>
                  <label
                    className="
                mt-1 flex items-center justify-between gap-3
                border border-gray-200 rounded-xl
                px-3 py-2 text-sm
                cursor-pointer
                hover:bg-gray-50
                transition
              "
                  >
                    <span className="truncate text-gray-500">
                      {form.gallery?.[num - 1]?.name ||
                        `Choose gallery image ${num}...`}
                    </span>
                    <div className="flex items-center gap-2 text-gray-500">
                      <ImageIcon size={16} />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        handleFileChange(`gallery${num}`, e.target.files)
                      }
                    />
                  </label>
                </div>
              ))}

              {/* STATUS */}
              <div>
                <label className="text-xs text-gray-500">Status *</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                  className="
              w-full mt-1 px-3 py-2 text-sm
              border border-gray-200 rounded-xl
              bg-white
            "
                >
                  <option>Available</option>
                  <option>Booked</option>
                  <option>Occupied</option>
                  <option>Maintenance</option>
                </select>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="
            px-5 py-2 text-xs
            border border-gray-200
            rounded-xl
            hover:bg-red-500 hover:text-white
            transition
          "
              >
                Cancel
              </button>

              <button
                onClick={save}
                className="
            px-6 py-2 text-xs
            rounded-xl
            bg-primary text-white
            hover:bg-primary/90
            transition
          "
              >
                {editing ? "Update Room" : "Create Room"}
              </button>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </Motion.div>
  );
}

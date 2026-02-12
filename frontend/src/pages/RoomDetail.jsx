import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Star,
  Users,
  Maximize,
  X,
  ChevronRight,
} from "lucide-react";
import AttractionsList from "./AttractionList";
import Seo from "../components/Seo";
import api from "../api/api";

export default function RoomDetail() {
  const today = new Date().toISOString().split("T")[0];
  const [reviewEmail, setReviewEmail] = useState("");
  const [bookingIdForReview, setBookingIdForReview] = useState(null);
  const [checkingBooking, setCheckingBooking] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  const [room, setRoom] = useState(null);
  const [similarRooms, setSimilarRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingPolicy, setBookingPolicy] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [children, setChildren] = useState(0);
  const capacityAdults = room?.capacityAdults || 4;

  // Initialize dates
  useEffect(() => {
    if (!checkIn) {
      setCheckIn(today);
    }
    if (!checkOut) {
      const next = new Date(today);
      next.setDate(next.getDate() + 1);
      setCheckOut(next.toISOString().split("T")[0]);
    }
  }, [id, today]);

  const fetchBookingPolicy = async () => {
    try {
      const res = await api.get("/public/booking-policy");
      setBookingPolicy(res.data.data);
    } catch (err) {
      console.error("Failed to fetch booking policy", err);
    }
  };

  const verifyBookingForReview = async () => {
    if (!reviewEmail) {
      alert("Please enter booking email");
      return;
    }

    try {
      setCheckingBooking(true);
      const res = await api.get("/testimonial/booking", {
        params: {
          roomId: id,
          email: reviewEmail,
        },
      });
      setBookingIdForReview(res.data.data.bookingId);
    } catch (err) {
      alert(err.response?.data?.message || "Booking not found");
    } finally {
      setCheckingBooking(false);
    }
  };

  const fetchRoom = async () => {
    try {
      setLoading(true);

      // 1️⃣ Current room
      const res = await api.get(`/room/${id}`);
      const roomData = res.data.data;
      setRoom(roomData);

      // 2️⃣ Reviews
      const reviewRes = await api.get(`/testimonial/room/${id}`);
      setReviews(reviewRes.data.data || []);

      // 3️⃣ Similar rooms (same type/category, exclude current)
      const similarRes = await api.get("/room", {
        params: {
          type: roomData.type,
        },
      });

      const filteredSimilar = (similarRes.data.data || []).filter(
        (r) => r._id !== roomData._id,
      );
      setSimilarRooms(filteredSimilar.slice(0, 3));
    } catch (err) {
      console.error(err);
      setRoom(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
    fetchBookingPolicy();
  }, [id]);

  const resetReviewModal = () => {
    setShowReviewForm(false);
    setReviewEmail("");
    setBookingIdForReview(null);
    setRating(5);
    setMessage("");
  };

  const submitReview = async () => {
    if (submittingReview) return;

    try {
      setSubmittingReview(true);
      await api.post("/testimonial", {
        bookingId: bookingIdForReview,
        rating,
        message,
      });
      alert("Review submitted successfully! Awaiting approval.");
      resetReviewModal();
      fetchRoom();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const isRoomBooked = room?.status === "Booked" || room?.status === "Occupied";

  const nights = (() => {
    if (!checkIn || !checkOut) return 1;
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    if (co <= ci) return 1;
    return Math.round((co - ci) / (1000 * 60 * 60 * 24)) || 1;
  })();

  // Fixed handleBookNow with proper validation and redirect
  const handleBookNow = async (e) => {
    e.preventDefault();

    if (isRoomBooked || redirecting) return;

    // Validation
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const todayDate = new Date(today);
    todayDate.setHours(0, 0, 0, 0);

    if (checkInDate < todayDate) {
      alert("Check-in date cannot be in the past.");
      return;
    }

    if (checkOutDate <= checkInDate) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    if (guests > capacityAdults) {
      alert(`Maximum ${capacityAdults} adults allowed in this room.`);
      return;
    }

    setRedirecting(true);

    try {
      // Prepare room data for booking
      const roomForBooking = {
        _id: room._id,
        id: room.id,
        name: room.name,
        type: room.type,
        pricePerNight: room.pricePerNight,
        mainImage: room.mainImage,
        capacityAdults: room.capacityAdults,
        description: room.description,
        roomSize: room.roomSize,
        features: room.features || [],
      };

      // Navigate to booking page
      navigate("/booking?step=2", {
        state: {
          room: roomForBooking,
          checkIn,
          checkOut,
          adults: guests,
          children,
          step: 2,
        },
      });
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to proceed to booking. Please try again.");
    } finally {
      setRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-primary mb-4">
            Room Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The room you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/rooms" className="btn-primary inline-block px-6 py-3">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = [room.mainImage, ...(room.gallery || [])].filter(
    Boolean,
  );

  return (
    <div className="bg-background min-h-screen relative pb-24 lg:pb-0">
      <Seo
        title={`${room.name} | Shiv Ganga Hotel`}
        description={room.description}
        path={`/rooms/${id}`}
        image={room.mainImage}
      />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            >
              <X size={40} />
            </button>
            <Motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Room View"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative h-[70vh] lg:h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={room.mainImage}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 text-white">
          <div className="container mx-auto">
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                to="/rooms"
                className="inline-flex items-center text-gray-300 hover:text-accent mb-8 transition-colors group"
              >
                <ArrowLeft
                  size={20}
                  className="mr-2 group-hover:-translate-x-1 transition-transform"
                />
                Back to Rooms
              </Link>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6 leading-tight">
                {room.name}
              </h1>
              <div className="flex flex-wrap items-center gap-8 text-lg">
                <span className="text-accent font-bold text-3xl md:text-4xl">
                  ₹{room.pricePerNight}{" "}
                  <span className="text-base md:text-lg text-gray-300 font-normal">
                    /night
                  </span>
                </span>
                <div className="h-8 w-px bg-white/20 hidden md:block"></div>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={
                          i < Math.floor(room.ratings?.average || 0)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          i < Math.floor(room.ratings?.average || 0)
                            ? ""
                            : "text-gray-500"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-gray-200 font-medium">
                    {room.ratings?.average?.toFixed(1) || 0} (
                    {room.ratings?.count || 0} Reviews)
                  </span>
                </div>
              </div>
            </Motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-16">
            {/* Overview */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-3xl font-serif text-primary mb-6">
                Room Overview
              </h2>
              <p className="text-text-secondary leading-relaxed text-lg mb-10">
                {room.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 not-prose">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
                  <div className="bg-primary/5 p-4 rounded-full text-primary">
                    <Maximize size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">
                      Room Size
                    </span>
                    <span className="font-semibold text-primary text-lg">
                      {room.roomSize || "350 sq. ft."}
                    </span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
                  <div className="bg-primary/5 p-4 rounded-full text-primary">
                    <Users size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">
                      Max Adults
                    </span>
                    <span className="font-semibold text-primary text-lg">
                      {room.capacityAdults || 2} Adults
                    </span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
                  <div className="bg-primary/5 p-4 rounded-full text-primary">
                    <Star size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">
                      Rating
                    </span>
                    <span className="font-semibold text-primary text-lg">
                      {room.ratings?.average?.toFixed(1) || 0}/5
                    </span>
                  </div>
                </div>
              </div>
            </Motion.div>

            {/* Features & Amenities */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-serif text-primary mb-8">
                Features & Amenities
              </h2>

              {/* Key Features */}
              {room.features?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                  {room.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50 border border-gray-100"
                    >
                      <Check className="text-accent flex-shrink-0" size={24} />
                      <span className="font-medium text-gray-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-10">No features listed</p>
              )}

              {/* Policies */}
              <div className="mb-16">
                <h2 className="text-3xl font-serif text-primary mb-6">
                  Policies
                </h2>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      Check-in / Check-out
                    </h4>
                    <p className="text-sm text-gray-600">
                      Check-in: {bookingPolicy?.checkInTime || "2:00 PM"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Check-out: {bookingPolicy?.checkOutTime || "12:00 PM"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      Cancellation
                    </h4>
                    <p className="text-sm text-gray-600">
                      Free cancellation up to{" "}
                      {bookingPolicy?.cancellationWindowHours || 24} hours
                      before check-in. Late cancellations are subject to a
                      one-night charge.
                    </p>
                    {bookingPolicy?.earlyCheckInFee > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        Early check-in fee: ₹{bookingPolicy.earlyCheckInFee}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              {galleryImages.length > 0 && (
                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-serif text-primary">
                      Room Gallery
                    </h2>
                    <p className="text-sm text-gray-500 italic">
                      Click to enlarge
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px]">
                    {galleryImages.map((img, idx) => (
                      <Motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className={`relative rounded-xl overflow-hidden cursor-pointer shadow-lg group ${
                          idx === 0
                            ? "md:col-span-2 md:row-span-2 h-full"
                            : "h-full"
                        }`}
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`${room.name} view ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Maximize
                            className="text-white drop-shadow-lg"
                            size={32}
                          />
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                </Motion.div>
              )}

              {/* Reviews */}
              <div className="pt-16">
                <h2 className="text-3xl font-serif text-primary mb-8">
                  Guest Reviews
                </h2>

                <button
                  onClick={() => setShowReviewForm(true)}
                  className="mb-6 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Write a Review
                </button>

                {/* Review Form Modal - FIXED */}
                <AnimatePresence>
                  {showReviewForm && (
                    <Motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                      onClick={(e) => {
                        if (e.target === e.currentTarget) resetReviewModal();
                      }}
                    >
                      <Motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white p-6 rounded-xl w-full max-w-md relative"
                      >
                        <button
                          onClick={resetReviewModal}
                          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
                        >
                          <X size={22} />
                        </button>

                        <h3 className="text-xl font-bold mb-4">
                          Write a Review
                        </h3>

                        {!bookingIdForReview ? (
                          <>
                            <input
                              type="email"
                              placeholder="Enter your booking email"
                              value={reviewEmail}
                              onChange={(e) => setReviewEmail(e.target.value)}
                              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                              required
                            />
                            <button
                              onClick={verifyBookingForReview}
                              disabled={checkingBooking}
                              className="bg-accent text-white w-full py-3 rounded-lg font-medium hover:bg-accent/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                              {checkingBooking
                                ? "Verifying..."
                                : "Verify Booking"}
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Rating Stars */}
                            <div className="flex justify-center gap-2 mb-6">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                  key={i}
                                  size={32}
                                  className="cursor-pointer transition-colors"
                                  fill={i <= rating ? "#FFD700" : "none"}
                                  stroke={i <= rating ? "#FFD700" : "#CBD5E0"}
                                  onClick={() => setRating(i)}
                                />
                              ))}
                            </div>

                            <textarea
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                              placeholder="Share your experience..."
                              rows={4}
                              required
                            />

                            <div className="flex justify-end gap-3">
                              <button
                                onClick={resetReviewModal}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={submitReview}
                                disabled={submittingReview || !message.trim()}
                                className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                              >
                                {submittingReview
                                  ? "Submitting..."
                                  : "Submit Review"}
                              </button>
                            </div>
                          </>
                        )}
                      </Motion.div>
                    </Motion.div>
                  )}
                </AnimatePresence>

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review, idx) => (
                      <Motion.div
                        key={review._id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-primary">
                              {review.name || "Guest"}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {review.createdAt
                                ? new Date(
                                    review.createdAt,
                                  ).toLocaleDateString()
                                : "Recent review"}
                            </span>
                          </div>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={
                                  i < review.rating ? "currentColor" : "none"
                                }
                                stroke={
                                  i < review.rating ? "currentColor" : "#CBD5E0"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">"{review.message}"</p>
                      </Motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">
                      No reviews yet. Be the first to review this room!
                    </p>
                  </div>
                )}
              </div>
            </Motion.div>
          </div>

          {/* Booking Sidebar - FIXED */}
          <div className="lg:col-span-1 border border-red-500">
            <div className="sticky top-28">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>

                <h3 className="text-2xl font-serif text-primary mb-2">
                  Book This Room
                </h3>
                <p className="text-gray-500 mb-8 text-sm">
                  Best price guarantee • Free cancellation
                </p>

                <form className="space-y-5" onSubmit={handleBooking}>
                  {/* Check In - Check Out */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Check In - Check Out
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="date"
                          value={checkIn}
                          min={today}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCheckIn(val);

                            const ci = new Date(val);
                            const co = new Date(checkOut);

                            if (!checkOut || co <= ci) {
                              const next = new Date(val);
                              next.setDate(next.getDate() + 1);
                              setCheckOut(next.toISOString().split("T")[0]);
                            }
                          }}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent outline-none text-sm"
                          required
                        />
                      </div>

                      <div className="relative">
                        <input
                          type="date"
                          value={checkOut}
                          min={checkIn || today}
                          onChange={(e) => {
                            const val = e.target.value;
                            const ci = new Date(checkIn || today);
                            const co = new Date(val);

                            if (co <= ci) {
                              const next = new Date(ci);
                              next.setDate(next.getDate() + 1);
                              setCheckOut(next.toISOString().split("T")[0]);
                            } else {
                              setCheckOut(val);
                            }
                          }}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent outline-none text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Adults */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Adults
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent outline-none text-sm"
                    >
                      {[...Array(Math.max(1, room?.capacityAdults || 4))].map(
                        (_, i) => (
                          <option key={`adult-${i + 1}`} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? "Adult" : "Adults"}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* Children - Fixed dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Children
                    </label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value))}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent outline-none text-sm"
                    >
                      {[...Array(7)].map((_, i) => (
                        <option key={`child-${i}`} value={i}>
                          {i}{" "}
                          {i === 1
                            ? "Child"
                            : i === 0
                              ? "No children"
                              : "Children"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Breakdown */}
                  <div className="py-6 border-t border-b border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Base Price</span>
                      <span>
                        ₹{room?.pricePerNight || 0} × {nights} night
                        {nights > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex justify-between items-center font-bold text-primary text-lg pt-2">
                      <span>Total</span>
                      <span>₹{(room?.pricePerNight || 0) * nights}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    type="submit"
                    disabled={isRoomBooked || redirecting}
                    className={`w-full py-4 text-center text-lg rounded transition-all duration-300
                ${
                  isRoomBooked || redirecting
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "btn-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-accent text-white hover:bg-accent-dark"
                }`}
                  >
                    {redirecting
                      ? "PROCESSING..."
                      : isRoomBooked
                        ? "ROOM BOOKED"
                        : "CHECK AVAILABILITY"}
                  </button>
                </form>

                {/* Features */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <Check className="text-green-500 flex-shrink-0" size={14} />
                    <span>No booking fees</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <Check className="text-green-500 flex-shrink-0" size={14} />
                    <span>Instant Confirmation</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <Check className="text-green-500 flex-shrink-0" size={14} />
                    <span>Free cancellation up to 24 hours</span>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-8 bg-primary/5 rounded-xl p-6 border border-primary/10">
                <h4 className="font-serif text-primary mb-2 text-lg">
                  Need Help?
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Our concierge team is available 24/7 to assist you with your
                  booking.
                </p>
                <a
                  href="tel:+911234567890"
                  className="inline-flex items-center gap-2 text-accent font-medium hover:underline text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Call +91 123 456 7890
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Rooms - FIXED */}
        <div className="pt-16 border-t border-gray-100">
          <h2 className="text-3xl font-serif text-primary mb-12 text-center">
            You May Also Like
          </h2>
          {similarRooms.length === 0 ? (
            <div className="flex justify-center">
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-lg shadow-sm">
                <h3 className="text-2xl font-serif text-primary mb-3">
                  More Rooms Coming Soon
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  We currently don't have any other rooms available in this
                  type. Please explore our other room types for more options.
                </p>
                <Link
                  to="/rooms"
                  className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition"
                >
                  View All Rooms
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-10">
              {similarRooms.map((similarRoom) => (
                <Link
                  to={`/rooms/${similarRoom._id}`}
                  key={similarRoom._id}
                  className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={similarRoom.mainImage}
                      alt={similarRoom.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                      {similarRoom.roomSize ||
                        similarRoom.size ||
                        "350 sq. ft."}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-serif text-primary group-hover:text-accent transition-colors">
                        {similarRoom.name}
                      </h3>
                      <span className="text-xl font-bold text-accent">
                        ₹{similarRoom.pricePerNight}
                      </span>
                    </div>

                    <p className="text-gray-500 mb-6 line-clamp-2">
                      {similarRoom.description}
                    </p>

                    <span className="inline-flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                      View Details <ChevronRight size={16} className="ml-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Attractions */}
        <div className="pt-16 border-t border-gray-100">
          <h2 className="text-3xl font-serif text-gray-800 text-center mb-8">
            Location Attractions
          </h2>
          <AttractionsList />
        </div>
      </div>
    </div>
  );
}

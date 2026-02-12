import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";
import { Printer } from "lucide-react";
import Sidebar from "./Sidebar";

const Receipt = () => {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchBooking = async () => {
    try {
      console.log("Fetching receipt for:", bookingId);

      const res = await api.get(
        `/offline-booking/receipt/${bookingId}`
      );

      console.log("Receipt response:", res.data);
      setBooking(res.data.data);
    } catch (err) {
      console.error("Failed to fetch receipt", err);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  if (bookingId) fetchBooking();
}, [bookingId]);



  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  if (loading) {
    return (
      <Sidebar>
        <div className="p-10 text-center font-bold">Loading receipt...</div>
      </Sidebar>
    );
  }

  if (!booking) {
    return (
      <Sidebar>
        <div className="p-10 text-center text-red-500 font-bold">
          Receipt not found
        </div>
      </Sidebar>
    );
  }

  const nights =
    (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) /
    (1000 * 60 * 60 * 24);

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a]">
              Booking Receipt
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Booking ID: <span className="font-bold">{booking.guestId}</span>
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#0f172a] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#D4AF37]"
          >
            <Printer size={16} /> Print
          </button>
        </div>

        {/* GUEST & STAY */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">
              Guest Details
            </h3>
            <p className="font-bold text-[#0f172a]">
              {booking.user.firstName} {booking.user.lastName}
            </p>
            <p className="text-sm text-slate-500">{booking.user.email}</p>
            <p className="text-sm text-slate-500">{booking.user.phoneNumber}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">
              Stay Details
            </h3>
            <p className="text-sm">
              Check-in:{" "}
              <span className="font-bold">
                {new Date(booking.checkInDate).toDateString()}
              </span>
            </p>
            <p className="text-sm">
              Check-out:{" "}
              <span className="font-bold">
                {new Date(booking.checkOutDate).toDateString()}
              </span>
            </p>
            <p className="text-sm">
              Nights: <span className="font-bold">{nights}</span>
            </p>
          </div>
        </div>

        {/* ROOM INFO */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">
            Room Details
          </h3>
          <div className="flex justify-between bg-slate-50 p-4 rounded-xl border">
            <div>
              <p className="font-bold text-[#0f172a]">
                Room {booking.room.roomNumber}
              </p>
              <p className="text-sm text-slate-500">{booking.room.name}</p>
              <p className="text-xs text-slate-400">
                Adults: {booking.adults} | Children: {booking.children}
              </p>
            </div>
            <div className="text-right font-bold">
              {formatCurrency(booking.totalAmount)}
            </div>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="border-t pt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Total Amount</span>
            <span className="font-bold">
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Paid</span>
            <span className="font-bold text-green-600">
              {formatCurrency(booking.paidAmount)}
            </span>
          </div>

          {booking.pendingAmount > 0 && (
            <div className="flex justify-between text-sm mb-2">
              <span>Pending</span>
              <span className="font-bold text-red-500">
                {formatCurrency(booking.pendingAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-lg font-black mt-4">
            <span>Status</span>
            <span
              className={`${
                booking.paymentStatus === "paid"
                  ? "text-green-600"
                  : "text-orange-500"
              }`}
            >
              {booking.paymentStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-xs text-slate-400">
          Thank you for staying with us • Shiv Ganga Hospitality
        </div>
      </div>
    </Sidebar>
  );
};

export default Receipt;

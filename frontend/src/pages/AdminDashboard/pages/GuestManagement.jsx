import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Users, RotateCw, Mail, Phone, MapPin, 
  Calendar, User, CheckCircle2, Home, Bed, Star, 
  ChevronRight, Users2, ShieldCheck, UserCheck,
  UserX, PhoneCall
} from "lucide-react";
import api from "../../axios";

// Helper function to format currency
const formatINR = (amount) => {
  if (!amount || isNaN(amount)) return "₹ 0";
  return `₹ ${amount.toLocaleString('en-IN')}`;
};

export default function GuestManagement() {
  const [guests, setGuests] = useState([]);
  const [stats, setStats] = useState({
    totalGuests: 0,
    checkedInGuests: 0,
    activeGuests: 0,
    inactiveGuests: 0
  });
  const [activeGuestId, setActiveGuestId] = useState(null);
  const [activeGuestDetails, setActiveGuestDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Pagination
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Get initial from name
  const getInitial = (name) => {
    if (!name) return "G";
    return name.charAt(0).toUpperCase();
  };

  // Fetch guest stats
  const fetchGuestStats = async () => {
    try {
      setStatsLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await api.get("/guests/stats", { headers });
      if (response.data?.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch guest stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch guest list
  const fetchGuestList = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        ...(search && { search })
      };
      
      const response = await api.get("/guests", { 
        headers,
        params 
      });
      
      if (response.data?.success) {
        const { data, total, totalPages, page } = response.data;
        setGuests(data || []);
        setTotalPages(totalPages || 1);
        setTotalRecords(total || 0);
        setCurrentPage(page || 1);
        
        // Set first guest as active if available
        if (data && data.length > 0 && !activeGuestId) {
          setActiveGuestId(data[0].id);
          fetchGuestDetails(data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch guest list:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch guest details

const fetchGuestDetails = async (guestId) => {
    if (!guestId) return;

    try {
      setDetailsLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [detailsRes, transactionsRes, historyRes] = await Promise.all([
        api.get(`/guests/${guestId}/details`, { headers }),
        api.get(`/guests/${guestId}/transactions`, { headers }),
        api.get(`/guests/${guestId}/bookings-history`, { headers }),
      ]);

      if (
        detailsRes.data?.success &&
        transactionsRes.data?.success &&
        historyRes.data?.success
      ) {
        const guestDetails = guests.find(
          (g) => String(g.id) === String(guestId),
        );

        setActiveGuestDetails({
          ...guestDetails,
          bookingDetails: detailsRes.data.data,
          transactionDetails: transactionsRes.data.data,
          bookingHistory: historyRes.data.data || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch guest details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fetch payment summary
  const fetchPaymentSummary = async (guestId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await api.get(`/guests/${guestId}/payment-summary`, { headers });
      return response.data?.success ? response.data.data : null;
    } catch (error) {
      console.error("Failed to fetch payment summary:", error);
      return null;
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchGuestStats();
    fetchGuestList(1, "");
  }, []);

  // Handle guest selection
  useEffect(() => {
    if (activeGuestId) {
      fetchGuestDetails(activeGuestId);
    }
  }, [activeGuestId]);

  // Handle search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGuestList(1, searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchGuestList(newPage, searchQuery);
    }
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'checked_in':
      case 'checked-in':
      case 'active':
        return "bg-green-100 text-green-700";
      case 'checked_out':
      case 'checked-out':
      case 'inactive':
        return "bg-gray-100 text-gray-700";
      case 'confirmed':
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Format status text
  const formatStatus = (status) => {
    if (!status) return "Inactive";
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 font-sans text-slate-900"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users2 className="text-gray-700" />
          <div className="text-sm font-bold uppercase tracking-widest text-gray-600">
            Guest Management
          </div>
          <div className="h-[1px] w-8 bg-accent"></div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">
                Total Guests
              </div>
              <div className="text-2xl font-bold text-primary mt-1">
                {statsLoading ? "..." : stats.totalGuests || 0}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-primary/10">
              <Users className="text-primary" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">
                Checked In
              </div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {statsLoading ? "..." : stats.checkedInGuests || 0}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-green-100">
              <UserCheck className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">
                Active Guests
              </div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {statsLoading ? "..." : stats.activeGuests || 0}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100">
              <Users className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">
                Inactive Guests
              </div>
              <div className="text-2xl font-bold text-gray-600 mt-1">
                {statsLoading ? "..." : stats.inactiveGuests || 0}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-gray-100">
              <UserX className="text-gray-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* MAIN TABLE SECTION */}
        <div className="flex-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            {/* SEARCH BOX */}
            <div className="p-4">
              <div className="flex items-center gap-2 border border-gray-300 rounded-2xl px-3 py-2.5 max-w-md">
                <Search size={18} className="text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-[15px] outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading guests...
                </div>
              ) : guests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No guests found
                </div>
              ) : (
                <>
                  <table className="w-full text-left border-t border-gray-200">
                    <thead className="bg-primary/5">
                      <tr className="text-[11px] uppercase font-bold border border-gray-200 text-gray-500 tracking-widest">
                        <th className="px-6 py-4">Guest Info</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4 text-center">Family</th>
                        <th className="px-6 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {guests.map((g) => (
                        <tr 
                          key={g.id} 
                          onClick={() => setActiveGuestId(g.id)}
                          className={`cursor-pointer transition-colors ${activeGuestId === g.id ? "bg-primary/[0.04]" : "hover:bg-gray-50"}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-primary/10 text-primary">
                                {getInitial(g.name)}
                              </div>
                              <div>
                                <p className="text-[15px] font-bold text-gray-800">{g.name}</p>
                                <p className="text-[11px] text-gray-400 uppercase font-medium">
                                  {g.email || "No email"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-[14px] text-gray-600 font-medium">{g.email}</span>
                              <span className="text-[12px] text-gray-400">{g.phoneNumber || "No phone"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-[15px] font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                              {g.familyMembers || (g.adults + g.children) || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className={`w-2 h-2 rounded-full ${
                                g.status === 'CHECKED_IN' ? 'bg-green-500' : 
                                g.status === 'CONFIRMED' ? 'bg-blue-500' : 'bg-gray-300'
                              }`} />
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wider ${
                                  g.status === "CHECKED_IN"
                                    ? "text-green-600"
                                    : g.status === "PENDING"
                                      ? "text-amber-500" // Light orange only for pending
                                      : "text-gray-400" // All other statuses grey
                                }`}
                              >
                                {formatStatus(g.status)}
                              </span>
                              <ChevronRight size={16} className={`${activeGuestId === g.id ? 'text-primary' : 'text-gray-300'}`} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* PAGINATION */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <span className="text-[11px] text-gray-400 uppercase tracking-widest">
                      Page {currentPage} of {totalPages} • {totalRecords} guests
                    </span>

                    <div className="flex gap-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl border 
                          ${currentPage === 1
                            ? "text-gray-300 border-gray-200 cursor-not-allowed"
                            : "text-gray-600 border-gray-300 hover:bg-gray-50"}
                        `}
                      >
                        Previous
                      </button>

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl border 
                          ${currentPage === totalPages
                            ? "text-gray-300 border-gray-200 cursor-not-allowed"
                            : "text-gray-600 border-gray-300 hover:bg-gray-50"}
                        `}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* GUEST DETAILS SIDEBAR */}
        <div className="w-full lg:w-[420px]">
          {activeGuestId && activeGuestDetails ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeGuestDetails.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden sticky top-6"
              >
                {detailsLoading ? (
                  <div className="p-8 text-center text-gray-500">
                    Loading details...
                  </div>
                ) : (
                  <>
                    {/* Header Profile Section */}
                    <div className="relative p-6 text-center bg-gray-50/50 border-b border-gray-100">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-primary mx-auto flex items-center justify-center text-3xl font-black text-white shadow-2xl mb-4 border-4 border-white">
                        {getInitial(activeGuestDetails.name)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                        {activeGuestDetails.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusClass(activeGuestDetails.status)}`}>
                          {formatStatus(activeGuestDetails.status)}
                        </span>
                      </div>
                    </div>

                    {/* Sidebar Content */}
                    <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto font-sans">
                      
                      {/* 1. BOOKING DETAILS */}
                      {activeGuestDetails.bookingDetails && (
                        <section>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-6 bg-primary rounded-full" />
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-600">Booking Details</h4>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                                  Check In
                                </p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {new Date(activeGuestDetails.bookingDetails.checkInDate).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                                  Check Out
                                </p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {new Date(activeGuestDetails.bookingDetails.checkOutDate).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-center">
                              <div>
                                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                                  Total
                                </p>
                                <p className="text-[15px] font-semibold text-primary">
                                  {activeGuestDetails.bookingDetails.totalGuests || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                                  Adults
                                </p>
                                <p className="text-[15px] font-semibold text-primary">
                                  {activeGuestDetails.bookingDetails.adults || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                                  Children
                                </p>
                                <p className="text-[15px] font-semibold text-primary">
                                  {activeGuestDetails.bookingDetails.children || 0}
                                </p>
                              </div>
                            </div>
                            {activeGuestDetails.bookingDetails.room && (
                              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                                <Home size={18} className="text-gray-400" />
                                <div>
                                  <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                                    Room Info
                                  </p>
                                  <p className="text-sm font-semibold text-gray-700">
                                    {activeGuestDetails.bookingDetails.room}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </section>
                      )}

                      {/* 2. TRANSACTION DETAILS */}
                      {activeGuestDetails.transactionDetails && (
                        <section>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-6 bg-emerald-500 rounded-full" />
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-600">
                              Payment Details
                            </h4>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                            {/* AMOUNTS */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                  Total Amount
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {formatINR(activeGuestDetails.transactionDetails.totalAmount)}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                  Paid Amount
                                </p>
                                <p className="text-sm font-semibold text-emerald-600">
                                  {formatINR(activeGuestDetails.transactionDetails.paidAmount)}
                                </p>
                              </div>
                            </div>

                            {/* PAYMENT STATUS */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                              <div>
                                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                  Payment Type
                                </p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {activeGuestDetails.transactionDetails.paymentType || "N/A"}
                                </p>
                              </div>

                              <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                activeGuestDetails.transactionDetails.paymentStatus === 'paid' ? 
                                'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {activeGuestDetails.transactionDetails.paymentStatus || "Pending"}
                              </span>
                            </div>

                            {/* PENDING AMOUNT */}
                            {activeGuestDetails.transactionDetails.pendingAmount > 0 && (
                              <div className="pt-4 border-t border-gray-100">
                                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                  Pending Amount
                                </p>
                                <p className="text-sm font-semibold text-red-600">
                                  {formatINR(activeGuestDetails.transactionDetails.pendingAmount)}
                                </p>
                              </div>
                            )}

                            {/* TRANSACTIONS LIST */}
                            {activeGuestDetails.transactionDetails.transactions && 
                             activeGuestDetails.transactionDetails.transactions.length > 0 && (
                              <div className="pt-4 border-t border-gray-100">
                                <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">
                                  Transactions
                                </p>
                                <div className="space-y-2">
                                  {activeGuestDetails.transactionDetails.transactions.map((txn, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
                                      <div>
                                        <p className="font-medium">{txn.mode}</p>
                                        <p className="text-xs text-gray-500">{txn.date ? new Date(txn.date).toLocaleDateString() : "N/A"}</p>
                                      </div>
                                      <p className="font-semibold">{formatINR(txn.amount)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </section>
                      )}

                      {/* 3. BOOKING HISTORY (previous & pending first) */}
                      {activeGuestDetails.bookingHistory &&
                        activeGuestDetails.bookingHistory.length > 0 && (
                          <section>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1 w-6 bg-indigo-500 rounded-full" />
                              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-600">
                                Booking History
                              </h4>
                            </div>

                            <div className="space-y-3">
                              {[...activeGuestDetails.bookingHistory]
                                .sort((a, b) => {
                                  const pendingA =
                                    (a.pendingAmount || 0) > 0 ? 1 : 0;
                                  const pendingB =
                                    (b.pendingAmount || 0) > 0 ? 1 : 0;
                                  if (pendingA !== pendingB) {
                                    return pendingB - pendingA; // pending on top
                                  }
                                  return (
                                    new Date(
                                      b.createdAt || b.checkInDate || 0,
                                    ) -
                                    new Date(a.createdAt || a.checkInDate || 0)
                                  );
                                })
                                .map((bk) => (
                                  <div
                                    key={bk.id}
                                    className="border border-gray-200 rounded-2xl p-4 bg-gray-50 space-y-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        Ref: {bk.bookingReference || "N/A"}
                                      </div>
                                      <span
                                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                          (bk.pendingAmount || 0) > 0
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-emerald-100 text-emerald-700"
                                        }`}
                                      >
                                        {(bk.pendingAmount || 0) > 0
                                          ? "Pending"
                                          : "Settled"}
                                      </span>
                                    </div>

                                    <div className="text-[11px] text-gray-500">
                                      {bk.checkInDate
                                        ? new Date(
                                            bk.checkInDate,
                                          ).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })
                                        : "—"}{" "}
                                      -{" "}
                                      {bk.checkOutDate
                                        ? new Date(
                                            bk.checkOutDate,
                                          ).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })
                                        : "—"}
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                      <div className="text-gray-700">
                                        {bk.room}
                                      </div>
                                      <div className="text-right text-xs">
                                        <div className="font-semibold text-gray-800">
                                          Total:{" "}
                                          {formatINR(bk.totalAmount || 0)}
                                        </div>
                                        <div className="text-emerald-600">
                                          Paid: {formatINR(bk.paidAmount || 0)}
                                        </div>
                                        {bk.pendingAmount > 0 && (
                                          <div className="text-red-600">
                                            Pending:{" "}
                                            {formatINR(bk.pendingAmount || 0)}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </section>
                        )}

                      {/* 3. CONTACT INFO */}
                      <section>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-1 w-6 bg-accent rounded-full" />
                          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-600">Contact Info</h4>
                        </div>
                        <div className="grid gap-3">
                          <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                            <Mail size={18} className="text-primary" />
                            <span className="text-sm font-semibold text-gray-700">
                              {activeGuestDetails.email || "No email"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                            <Phone size={18} className="text-primary" />
                            <span className="text-sm font-semibold text-gray-700">
                              {activeGuestDetails.phoneNumber || activeGuestDetails.phone || "No phone"}
                            </span>
                          </div>
                        </div>
                      </section>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center">
              <Users2 className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Select a guest to view details</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
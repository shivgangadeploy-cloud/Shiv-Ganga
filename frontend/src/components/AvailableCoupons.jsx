import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

const AvailableCoupons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // yaha se aayega
  const mode = location.state?.mode || "public";
  const amount = location.state?.amount || 0;
  const bookingDraft = location.state?.bookingDraft || {}; // preserve booking form data when returning

  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const url =
        mode === "receptionist" ? "/receptionist/coupon" : "/public/coupon";

      const res = await api.get(url);
      setCoupons(res.data.data || []);
    } catch {
      setError("Failed to load coupons");
    }
  };

  const applyCoupon = async (code) => {
    try {
      const url =
        mode === "receptionist"
          ? "/receptionist/coupon/apply"
          : "/public/coupon/apply";

      const res = await api.post(url, { code, amount });

      const redirectPath =
        mode === "receptionist" ? "/receptionist/new-booking" : "/booking";

      navigate(redirectPath, {
        replace: true,
        state: {
          appliedCoupon: res.data.coupon,
          bookingDraft,
          fromCoupon: true, // 🔥 FLAG
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Invalid coupon");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Available Coupons</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* show placeholder if no coupons available */}
      {coupons.length === 0 && !error && (
        <div className="border rounded-xl p-6 mb-4 text-center min-h-[500px] flex flex-col items-center justify-center">
          <p className="text-lg font-semibold mb-3">No coupons here</p>
          <p className="text-sm text-slate-500 mb-4">
            There are currently no coupons available for your booking.
          </p>
          <button
            onClick={() => {
              // navigate back to booking page retaining draft state
              const redirectPath =
                mode === "receptionist"
                  ? "/receptionist/new-booking"
                  : "/booking";
              navigate(redirectPath, {
                replace: true,
                state: {
                  bookingDraft, // keep original object under bookingDraft key
                  fromCoupon: true, // flag so page restores values
                },
              });
            }}
            className="px-5 py-2 border rounded-lg font-semibold text-sm bg-gray-100 hover:bg-gray-200"
          >
            Back
          </button>
        </div>
      )}

      {coupons.map((c) => (
        <div
          key={c._id}
          className="border rounded-xl p-4 mb-3 flex justify-between items-center"
        >
          <div>
            <p className="font-mono font-bold">{c.code}</p>
            <p className="text-sm text-slate-500">{c.discountPercent}% OFF</p>
          </div>

          <button
            onClick={() => applyCoupon(c.code)}
            className="bg-[#0f172a] text-white px-4 py-2 rounded-lg"
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  );
};

export default AvailableCoupons;

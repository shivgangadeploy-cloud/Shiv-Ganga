import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

const AvailableCoupons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // yaha se aayega
  const mode = location.state?.mode || "public";
  const amount = location.state?.amount || 0;
const bookingDraft = location.state?.bookingDraft;

  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const url =
        mode === "receptionist"
          ? "/receptionist/coupon"
          : "/public/coupon";

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
  mode === "receptionist"
    ? "/receptionist/new-booking"
    : "/booking";

navigate(redirectPath, {
  replace: true,
  state: {
    appliedCoupon: res.data.coupon,
    bookingDraft,
    fromCoupon: true     // 🔥 FLAG
  }
});




    } catch (err) {
      alert(err.response?.data?.message || "Invalid coupon");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Available Coupons</h1>

      {error && <p className="text-red-500">{error}</p>}

      {coupons.map(c => (
        <div
          key={c._id}
          className="border rounded-xl p-4 mb-3 flex justify-between items-center"
        >
          <div>
            <p className="font-mono font-bold">{c.code}</p>
            <p className="text-sm text-slate-500">
              {c.discountPercent}% OFF
            </p>
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

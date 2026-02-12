const CouponApply = ({ mode = "public", amount, onApply }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE =
    mode === "receptionist"
      ? "/receptionist/coupon"
      : "/public/coupon";

  const applyCoupon = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post(`${API_BASE}/apply`, {
        code,
        amount
      });

      onApply(res.data.coupon);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 border rounded-xl p-4 space-y-3">
      <label className="text-xs font-bold text-slate-500 uppercase">
        Coupon Code
      </label>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Enter coupon code"
        className="w-full border p-3 rounded-lg font-mono font-bold"
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <button
        onClick={applyCoupon}
        disabled={loading || !code}
        className="w-full bg-[#0f172a] text-white py-3 rounded-lg font-bold"
      >
        {loading ? "Applying..." : "Apply Coupon"}
      </button>
    </div>
  );
};

export default CouponApply;

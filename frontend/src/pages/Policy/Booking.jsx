import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function SetBookingPolicy() {

    const [form, setForm] = useState({
        checkInTime: "",
        checkOutTime: "",
        earlyCheckInFee: 0,
        cancellationWindowHours: 24
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ✅ Load existing policy
    useEffect(() => {
        fetchPolicy();
    }, []);

    const fetchPolicy = async () => {
        try {
            const res = await api.get("/booking-policy");

            if (res.data?.data) {
                setForm(res.data.data);
            }
        } catch (err) {
            console.error("Failed to load policy");
        } finally {
            setLoading(false);
        }
    };

    // ✅ handle input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                name === "earlyCheckInFee" ||
                    name === "cancellationWindowHours"
                    ? Number(value)
                    : value
        }));
    };

    // ✅ save policy
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            await api.post("/booking-policy", form);

            alert("Booking policy updated successfully");
        } catch (err) {
            alert("Failed to update policy");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading policy...</div>;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-slate-800">
                        Booking Policy
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Configure hotel check-in, checkout and cancellation rules
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Time Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-semibold">
                                Check-In Time
                            </label>
                            <input
                                type="time"
                                name="checkInTime"
                                value={form.checkInTime}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-semibold">
                                Check-Out Time
                            </label>
                            <input
                                type="time"
                                name="checkOutTime"
                                value={form.checkOutTime}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                    </div>

                    {/* Fees Section */}
                    <div className="space-y-6">

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-semibold">
                                Early Check-In Fee (₹)
                            </label>
                            <input
                                type="number"
                                name="earlyCheckInFee"
                                value={form.earlyCheckInFee}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="Enter amount"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-semibold">
                                Free Cancellation Window (Hours)
                            </label>
                            <input
                                type="number"
                                name="cancellationWindowHours"
                                value={form.cancellationWindowHours}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="e.g. 24"
                            />
                        </div>

                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100 pt-6 flex justify-end">

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}
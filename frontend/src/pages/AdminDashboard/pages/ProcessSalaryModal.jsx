import React, { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { X, Check, IndianRupee } from "lucide-react";
import api from "../../axios";

export default function ProcessSalaryModal({ staff, onClose, onProcessed }) {
  const [month, setMonth] = useState("FEB");
  const [year, setYear] = useState(new Date().getFullYear());
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [deductions, setDeductions] = useState(0);

  // helper to enforce non-negative numbers from inputs
  const clampNumber = (value) => {
    let n = Number(value);
    if (isNaN(n) || n < 0) n = 0;
    return n;
  };
  const [loading, setLoading] = useState(false);

  /* ✅ AUTO FILL BASIC SALARY */
  useEffect(() => {
    if (staff?.base !== undefined) {
      setBasicSalary(staff.base);
    }
  }, [staff]);

  const netPayable =
    Number(basicSalary) + Number(allowances) - Number(deductions);

  const handleProcessSalary = async () => {
    try {
      setLoading(true);

      await api.post("/staff-salary/process", {
        receptionistId: staff.staffId,
        month,
        year,
        basicSalary,
        allowances,
        deductions,
        paymentMethod: "CASH",
      });

      alert("Salary processed successfully");
      onProcessed();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process salary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <Motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg z-10 p-6 space-y-5"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-sm font-bold uppercase tracking-widest">
            Process Salary
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* STAFF INFO */}
        <div className="bg-slate-50 rounded-xl p-4 border">
          <p className="text-sm font-semibold text-gray-700">{staff.name}</p>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest">
            {staff.displayId} • {staff.dept}
          </p>
        </div>

        {/* MONTH / YEAR */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            >
              {[
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
                "OCT",
                "NOV",
                "DEC",
              ].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>
        </div>

        {/* SALARY INPUTS */}
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Basic Salary
            </label>
            <input
              type="number"
              min={0}
              value={basicSalary}
              onChange={(e) => setBasicSalary(clampNumber(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Allowances
            </label>
            <input
              type="number"
              min={0}
              value={allowances}
              onChange={(e) => setAllowances(clampNumber(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Deductions
            </label>
            <input
              type="number"
              min={0}
              value={deductions}
              onChange={(e) => setDeductions(clampNumber(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>
        </div>

        {/* NET PAYABLE */}
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
            Net Payable
          </p>
          <p className="text-2xl font-black text-primary mt-1 flex justify-center items-center gap-1">
            <IndianRupee size={18} /> {Math.max(0, netPayable).toLocaleString()}
          </p>
        </div>

        {/* ACTION */}
        <button
          disabled={loading}
          onClick={handleProcessSalary}
          className="w-full bg-primary text-white py-2.5 rounded-lg text-xs font-bold uppercase flex justify-center gap-2"
        >
          <Check size={14} />
          {loading ? "Processing..." : "Process Salary"}
        </button>
      </Motion.div>
    </div>
  );
}

import React, { useState, useMemo, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import ProcessSalaryModal from "./ProcessSalaryModal";

import {
  Download,
  FileText,
  Banknote,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Filter,
  Users,
  CheckCircle2,
  ReceiptIndianRupee,
  ChevronDown,
  X,
  Check,
  IndianRupee,
} from "lucide-react";
import api from "../../axios";

/* ================= CONFIG ================= */
const GLOBAL_CONFIG = {
  overtimeRate: 0,
  taxRate: 0,
  currency: "₹",
};
const DEPARTMENTS = [
  { label: "All Departments", value: "all" },
  { label: "Receptionist", value: "receptionist" },
  { label: "Front Desk", value: "front_desk" },
  { label: "Housekeeping", value: "housekeeping" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Security", value: "security" },
  { label: "Management", value: "management" },
];

export default function PayrollManagement() {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [view, setView] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processStaff, setProcessStaff] = useState(null);

  const [stats, setStats] = useState({
    netDisbursement: 0,
    outstanding: 0,
    activeStaff: 0,
  });

  // --- FETCH STAFF PAYMENTS ---
  const fetchStaffPayments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/staff-salary/staff-list", {
        params: { month: "FEB", year: 2026 },
      });

      const mapped = res.data.data.map((s) => ({
        id: s.salaryId || s._id,
        staffId: s._id,
        displayId: s.employeeId,
        name: s.name,

        dept: s.role, // 🔥 raw backend role
        deptLabel: s.role.replace("_", " ").toUpperCase(),

        base: Number(s.basicSalary) || 0,
        bonus: Number(s.allowances) || 0,
        deductions: Number(s.deductions) || 0,
        net: Number(s.totalPayable) || 0,

        status: s.salaryStatus === "PAID" ? "Paid" : "Pending",
        salaryId: s.salaryId || null,
      }));

      setStaffList(mapped);
      setStats((prev) => ({
        ...prev,
        activeStaff: mapped.length,
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- FETCH PAYROLL STATS ---
  const fetchPayrollStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await api.get("/staff-salary/stats", { headers });

      if (response.data.success) {
        setStats({
          netDisbursement: response.data.totalPaidThisMonth || 0,
          outstanding: response.data.outstanding || 0,
          activeStaff: response.data.totalStaff || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching payroll stats:", error);
    }
  };

  useEffect(() => {
    fetchStaffPayments();
    fetchPayrollStats();
  }, []);

  // --- CALCULATE NET AMOUNT ---
  const payrollData = useMemo(() => {
    return staffList;
  }, [staffList]);

  // --- FILTER DATA ---
  const filteredData = payrollData.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.displayId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === "all" || s.dept === selectedDept;

    const matchesView = view === "all" || s.status.toLowerCase() === view;

    return matchesSearch && matchesDept && matchesView;
  });

  const openProcessSalaryModal = (staff) => {
    setProcessStaff(staff);
  };

  // --- PROCESS PAYMENT (CASH) ---
  const handlePaymentConfirm = async (salaryId, netAmount) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await api.post(
        "/staff-salary/payout",
        { salaryId },
        { headers },
      );

      if (response.data.success) {
        // Update local state
        setStaffList((prev) =>
          prev.map((s) =>
            s.id === salaryId
              ? {
                  ...s,
                  status: "Paid",
                  lastDate: new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                }
              : s,
          ),
        );

        // Update stats
        setStats((prev) => ({
          ...prev,
          netDisbursement: prev.netDisbursement + netAmount,
          outstanding: prev.outstanding - netAmount,
        }));

        setSelectedStaff(null);
        alert("Payment processed successfully!");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Payment processing failed";
      alert(errorMsg);
    }
  };

  // --- EXPORT CSV ---
  const handleExportCSV = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Department",
      "Basic Salary",
      "Allowances",
      "Deductions",
      "Net Amount",
      "Status",
      "Payment Method",
      "Last Paid Date",
    ];

    const rows = filteredData.map((staff) => [
      staff.displayId,
      staff.name,
      staff.dept,
      staff.base,
      staff.bonus,
      staff.deductions,
      staff.net,
      staff.status,
      staff.paymentMethod,
      staff.lastDate === "-" ? "N/A" : staff.lastDate,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Staff_Payroll_Report_${new Date().toISOString().split("T")[0]}.csv`,
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 px-2 sm:px-0 pb-10 text-slate-900">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <ReceiptIndianRupee className="text-gray-700" size={20} />
          <div className="text-sm font-bold uppercase tracking-widest text-gray-600">
            Payroll Management
          </div>
          <div className="h-[1px] w-8 bg-accent"></div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
        <StatCard
          title="Net Disbursement"
          value={`${GLOBAL_CONFIG.currency}${stats.netDisbursement.toLocaleString()}`}
          icon={Banknote}
          color="text-primary"
        />

        <StatCard
          title="Outstanding"
          value={`${GLOBAL_CONFIG.currency}${stats.outstanding.toLocaleString()}`}
          icon={Clock}
          color="text-accent"
        />

        <StatCard
          title="Active Staff"
          value={stats.activeStaff}
          icon={Users}
          color="text-slate-700"
        />
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search employee..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="
      appearance-none
      pl-4 pr-10 py-2.5
      bg-slate-50
      border border-slate-200
      rounded-xl
      text-[11px]
      font-bold
      uppercase
      tracking-widest
      text-slate-600
      cursor-pointer
      hover:bg-slate-100
      focus:outline-none
      focus:ring-1
      focus:ring-primary/20
      transition-all
    "
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>

            {/* custom arrow */}
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            {["all", "pending", "paid"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  view === v
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-400"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                  Employee
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  Dept
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                  Basic Pay
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                  Allowances
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  Net Amount
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-sm text-slate-400"
                  >
                    Loading payroll data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-sm text-slate-400"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredData.map((staff, idx) => (
                    <Motion.tr
                      key={staff.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      {/* EMPLOYEE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">
                              {staff.name}
                            </p>
                            <p className="text-[11px] text-gray-500 uppercase tracking-widest">
                              {staff.displayId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DEPT */}
                      <td className="px-6 py-4 text-center">
                        <span className="text-[11px] uppercase tracking-widest">
                          {staff.deptLabel}
                        </span>
                      </td>

                      {/* BASIC PAY */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {GLOBAL_CONFIG.currency}
                        {staff.base.toLocaleString()}
                      </td>

                      {/* ALLOWANCES */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-emerald-600">
                          + {GLOBAL_CONFIG.currency}
                          {staff.bonus.toLocaleString()}
                        </p>
                      </td>

                      {/* NET AMOUNT */}
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-accent">
                          {GLOBAL_CONFIG.currency}
                          {staff.net.toLocaleString()}
                        </span>
                      </td>

                      {/* STATUS (ONLY TEXT/BADGE) */}
                      <td className="px-6 py-4 text-center">
                        {staff.status === "Paid" ? (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            Paid
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* ACTION (ONLY BUTTON) */}
                      <td className="px-6 py-4 text-center">
                        {staff.status === "Paid" ? (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                            —
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              if (staff.salaryId) {
                                setSelectedStaff(staff); // Pay Now
                              } else {
                                openProcessSalaryModal(staff); // Process Salary
                              }
                            }}
                            className={`px-4 py-1.5 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow transition-all
        ${staff.salaryId ? "bg-accent" : "bg-slate-700"}
      `}
                          >
                            {staff.salaryId ? "Pay Now" : "Process Salary"}
                          </button>
                        )}
                      </td>
                    </Motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PAYMENT MODAL ================= */}
      {processStaff && (
        <ProcessSalaryModal
          staff={processStaff}
          onClose={() => setProcessStaff(null)}
          onProcessed={fetchStaffPayments}
        />
      )}

      <AnimatePresence>
        {selectedStaff && (
          <PaymentActionModal
            employee={selectedStaff}
            onClose={() => setSelectedStaff(null)}
            onConfirm={handlePaymentConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= PAYMENT MODAL COMPONENT ================= */
function PaymentActionModal({ employee, onClose, onConfirm }) {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [note, setNote] = useState("");

  const total = employee.net;

  const handleSubmit = () => {
    onConfirm(employee.salaryId, total);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3">
      {/* BACKDROP */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* MODAL */}
      <Motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="
          bg-white rounded-2xl shadow-2xl w-full max-w-xl
          relative z-10 border border-slate-200
          max-h-[90vh] flex flex-col
        "
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">
              Process Salary
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              {employee.name} • {employee.displayId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🔥 SCROLLABLE CONTENT */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* EMPLOYEE INFO */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              {employee.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">
                {employee.name}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {employee.dept} • {employee.displayId}
              </div>
            </div>
          </div>

          {/* SALARY BREAKDOWN */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Basic Salary</span>
              <span className="font-semibold">
                ₹{employee.base.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Allowances</span>
              <span className="font-semibold text-emerald-600">
                + ₹{employee.bonus.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Deductions</span>
              <span className="font-semibold text-red-600">
                - ₹{employee.deductions.toLocaleString()}
              </span>
            </div>

            <div className="pt-3 border-t flex justify-between">
              <span className="font-bold">Net Payable</span>
              <span className="font-bold text-accent">
                ₹{employee.net.toLocaleString()}
              </span>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["CASH", "BANK", "UPI"].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all
                    ${
                      paymentMethod === method
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* NOTE */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Note (Optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add payment note or reference..."
              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-[11px] resize-none focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {/* NET DISPLAY */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 text-center">
            <span className="text-[10px] font-bold uppercase text-primary">
              Amount to be Paid
            </span>
            <div className="text-3xl font-black text-primary mt-1">
              ₹{Math.round(total).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Payment Method: {paymentMethod}
            </div>
          </div>
        </div>

        {/* ✅ STICKY FOOTER */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[10px] font-bold text-slate-500 uppercase hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary text-white text-[10px] font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 flex items-center gap-2 uppercase tracking-widest"
          >
            <Check size={14} /> Confirm Cash Payment
          </button>
        </div>
      </Motion.div>
    </div>
  );
}

/* ================= STAT CARD COMPONENT ================= */
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-primary/20 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
            {title}
          </p>
          <h2
            className={`text-2xl font-black mt-1 tracking-tight text-gray-800`}
          >
            {value}
          </h2>
        </div>
        <div
          className={`p-3 rounded-xl bg-slate-50 ${color} group-hover:scale-110 transition-all duration-300`}
        >
          <Icon size={22} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
          <ArrowUpRight size={12} /> SECURE
        </div>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
          Live Data
        </span>
      </div>
    </div>
  );
}

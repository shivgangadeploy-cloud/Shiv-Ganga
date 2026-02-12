import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search, ChevronRight,
  Tag, Calendar, Clock,
  MoreHorizontal, Trash2, Edit2,
  X, Zap, Plus,
  Copy, Check, Power, PowerOff
} from "lucide-react";

import api from "../../axios";

/* ================= COMPONENT ================= */
const DiscountCoupons = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const [coupons, setCoupons] = useState([]);

  const initialFormState = {
    id: null,
    code: "",
    type: "Percentage",
    value: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    limit: "",
    isScheduled: false
  };

  const [formData, setFormData] = useState(initialFormState);

  /* 🔥 INLINE EDIT STATES */
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const isSelectionMode = location.state?.fromPayment;

  const menuRef = useRef(null);
  const formTopRef = useRef(null);

  /* ================= FETCH - BACKEND CONNECTED ================= */
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/admin/coupon");
      const mapped = res.data.data.map(c => {
        // Calculate status properly
        const now = new Date();
        const expiry = c.expiryDate ? new Date(c.expiryDate) : null;
        const start = c.startDate ? new Date(c.startDate) : null;
        
        let status;
        if (!c.isActive) {
          status = "Deactivated";
        } else if (start && start > now) {
          status = "Scheduled";
        } else if (expiry && expiry < now) {
          status = "Expired";
        } else {
          status = "Active";
        }
        
        return {
          id: c._id,
          code: c.code,
          type: "Percentage",
          value: c.discountPercent,
          status: status,
          used: c.usageCount || 0,
          startDate: c.startDate || c.createdAt,
          endDate: c.expiryDate || c.createdAt,
          limit: c.usageLimit || ""
        };
      });
      setCoupons(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FORM ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (coupon) => {
    setIsEditing(true);
    setActiveMenuId(null);

    setFormData({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      startDate: new Date(coupon.startDate).toISOString().split("T")[0],
      endDate: new Date(coupon.endDate).toISOString().split("T")[0],
      limit: coupon.limit,
      isScheduled: !!coupon.startDate
    });

    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(initialFormState);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      code: formData.code,
      discountPercent: Number(formData.value),
      startDate: formData.isScheduled ? formData.startDate : null,
      expiryDate: formData.endDate,
      usageLimit: formData.limit ? Number(formData.limit) : null // 🔥 ADD
    };

    if (isEditing && formData.id) {
      await api.put(`/admin/coupon/${formData.id}`, payload);
    } else {
      await api.post("/admin/coupon", payload);
    }

    fetchCoupons();
    setIsEditing(false);
    setFormData(initialFormState);
  } catch (err) {
    alert(err.response?.data?.message || "Save failed");
  }
};

  /* ================= INLINE EDIT - BACKEND CONNECTED ================= */
  const handleInlineEditClick = (coupon) => {
    setEditingId(coupon.id);
    setActiveMenuId(null);

    setEditFormData({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      status: coupon.status,
      startDate: new Date(coupon.startDate).toISOString().split("T")[0],
      endDate: new Date(coupon.endDate).toISOString().split("T")[0],
      limit: coupon.limit || ""
    });
  };

  const handleInlineFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

const handleInlineSave = async () => {
  try {
    await api.put(`/admin/coupon/${editFormData.id}`, {
      code: editFormData.code,
      discountPercent: Number(editFormData.value),
      expiryDate: editFormData.endDate,
      startDate: editFormData.startDate,
      usageLimit: editFormData.limit
        ? Number(editFormData.limit)
        : null
    });

    const originalCoupon = coupons.find(c => c.id === editFormData.id);
    if (originalCoupon) {
      const shouldBeActive =
        editFormData.status === "Active" ||
        editFormData.status === "Scheduled";

      const isCurrentlyActive =
        originalCoupon.status !== "Deactivated";

      if (shouldBeActive !== isCurrentlyActive) {
        if (shouldBeActive) {
          await api.patch(
            `/admin/coupon/${editFormData.id}/enable`
          );
        } else {
          await api.patch(
            `/admin/coupon/${editFormData.id}/disable`
          );
        }
      }
    }

    setEditingId(null);
    setEditFormData({});
    fetchCoupons();
  } catch (err) {
    alert(err.response?.data?.message || "Update failed");
  }
};


  const handleInlineCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  /* ================= DELETE - BACKEND CONNECTED ================= */
  const handleDelete = async (id) => {
    setActiveMenuId(null);
    if (!window.confirm("Delete this coupon?")) return;

    try {
      await api.delete(`/admin/coupon/${id}`);
      fetchCoupons();
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= ENABLE / DISABLE - BACKEND CONNECTED ================= */
 const handleToggleStatus = async (id, status) => {
  setActiveMenuId(null);
  try {
    if (status === "Deactivated") {
      await api.patch(`/admin/coupon/${id}/enable`);
    } else {
      await api.patch(`/admin/coupon/${id}/disable`);
    }
    fetchCoupons();
  } catch {
    alert("Status update failed");
  }
};


  /* ================= COPY ================= */
  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ================= SELECT COUPON (for payment page) ================= */
  const handleSelectCoupon = (coupon) => {
    if (coupon.status === 'Active') {
      navigate(-1, { 
        state: { 
          selectedCoupon: {
            code: coupon.code,
            discount: coupon.value
          }
        }
      });
    }
  };

  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === "All" || c.status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyles = (status) => {
    switch (status) {
      case "Active":
        return { badge: "bg-emerald-100 text-emerald-700", border: "border-emerald-200", bg: "bg-emerald-50/50", text: "text-emerald-700" };
      case "Scheduled":
        return { badge: "bg-blue-100 text-blue-700", border: "border-blue-200", bg: "bg-blue-50/50", text: "text-blue-700" };
      case "Expired":
        return { badge: "bg-orange-100 text-orange-700", border: "border-orange-200", bg: "bg-orange-50/50", text: "text-orange-700" };
      case "Deactivated":
        return { badge: "bg-red-100 text-red-700", border: "border-red-200", bg: "bg-red-50/50", text: "text-red-700" };
      default:
        return { badge: "bg-gray-100 text-gray-600", border: "border-gray-200", bg: "bg-gray-50", text: "text-gray-600" };
    }
  };
  
  return (
   
        
       
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">

            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 font-medium">
              <ChevronRight size={14} />
              <span className="text-slate-900 font-bold">Discount Coupons</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-2">Manage Coupons</h1>
                  <p className="text-slate-500 font-medium max-w-lg">Create, schedule, and track discount offers to boost occupancy.</p>
              </div>
              
             
              <div className="relative w-full md:w-auto md:min-w-[300px]">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search coupons..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all shadow-sm text-sm"
                  />
              </div>
            </div>

          
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
               
                <div ref={formTopRef} className="order-1 lg:order-2 lg:col-span-4 lg:sticky lg:top-6">
                  
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100/80">
                        
                        <div className="bg-[#0f172a] p-6 flex justify-between items-center relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                           <div className="relative z-10">
                             <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                {isEditing ? <Edit2 size={18} className="text-[#D4AF37]" /> : <Plus size={18} className="text-[#D4AF37]" />} 
                                {isEditing ? 'Edit Coupon' : 'Create Coupon'}
                             </h3>
                             <p className="text-slate-400 text-xs font-medium mt-1">Configure discount details below</p>
                           </div>
                           {isEditing && (
                               <button onClick={handleCancelEdit} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors relative z-10" title="Cancel Edit">
                                   <X size={18} />
                               </button>
                           )}
                        </div>

                    
                        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-gradient-to-b from-white to-slate-50/50">
                           <div className="space-y-3">
                              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest ml-1">Coupon Code</label>
                              <div className="relative group">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f172a] transition-colors" size={18} />
                                <input name="code" value={formData.code} onChange={handleInputChange} type="text" placeholder="e.g. MONSOON30" className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:border-transparent transition-all text-sm font-bold text-[#0f172a] uppercase placeholder:normal-case shadow-sm focus:shadow-md" required />
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest ml-1">Type</label>
                                <div className="relative">
                                    <select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-sm font-bold text-slate-700 appearance-none shadow-sm cursor-pointer" >
                                      <option value="Percentage">Percent (%)</option>
                                      <option value="Fixed">Fixed (₹)</option>
                                    </select>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest ml-1">Value</label>
                                <input name="value" value={formData.value} onChange={handleInputChange} type="number" placeholder="e.g. 20" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-sm font-bold text-[#0f172a] shadow-sm" required />
                              </div>
                           </div>
                           <div className="border-t border-slate-200/60 my-1"></div>
                           <div className="flex items-center justify-between py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm transition-all hover:border-slate-300">
                              <label className="text-sm font-bold text-[#0f172a] flex items-center gap-3 cursor-pointer select-none" htmlFor="scheduleToggle">
                                 <div className={`size-8 rounded-lg flex items-center justify-center ${formData.isScheduled ? 'bg-[#D4AF37] text-[#0f172a]' : 'bg-slate-100 text-slate-400 border border-slate-200'} transition-colors`}>
                                    <Clock size={16} />
                                 </div>
                                 <div className="flex flex-col">
                                    <span>Schedule?</span>
                                    <span className="text-[10px] text-slate-400 font-normal">Set future date</span>
                                 </div>
                              </label>
                              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                  <input type="checkbox" name="toggle" id="scheduleToggle" checked={formData.isScheduled} onChange={(e) => setFormData({...formData, isScheduled: e.target.checked})} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out checked:right-0 right-5 checked:border-[#D4AF37]" />
                                  <label htmlFor="scheduleToggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-300 ${formData.isScheduled ? 'bg-[#0f172a]' : 'bg-slate-200'}`}></label>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                  {formData.isScheduled && (
                                      <div className="space-y-3">
                                         <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                                         <input name="startDate" value={formData.startDate} onChange={handleInputChange} type="date" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0f172a] shadow-sm" required />
                                      </div>
                                  )}
                                  <div className={`space-y-3 ${!formData.isScheduled ? 'col-span-2' : ''}`}>
                                     <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                     <input name="endDate" value={formData.endDate} onChange={handleInputChange} type="date" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0f172a] shadow-sm" required />
                                  </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest ml-1">Usage Limit (Optional)</label>
                              <input name="limit" value={formData.limit} onChange={handleInputChange} type="number" placeholder="e.g. 100" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-sm font-bold text-[#0f172a] shadow-sm" />
                           </div>
                           <button type="submit" className="w-full bg-[#0f172a] hover:bg-[#D4AF37] hover:text-[#0f172a] text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-[#D4AF37]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm mt-4" >
                                {isEditing ? (<> <Edit2 size={18} /> Update Coupon </>) : (formData.isScheduled ? <><Clock size={18} /> Schedule Coupon</> : <><Zap size={18} /> Create Instantly</>)}
                           </button>
                        </form>
                    </div>
                </div>

             
                <div className="order-2 lg:order-1 lg:col-span-8 space-y-6">
                    
                   
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide border-b border-slate-200">
                        {['All', 'Active', 'Scheduled', 'Expired', 'Deactivated'].map(status => (
                        <button 
                            key={status} 
                            onClick={() => setActiveFilter(status)}
                            className={`relative px-5 py-3 text-sm font-bold transition-all whitespace-nowrap ${
                                activeFilter === status 
                                ? 'text-[#0f172a]' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {status}
                            {activeFilter === status && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37] rounded-t-full"></span>
                            )}
                        </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-5">
                        {filteredCoupons.length > 0 ? (
                            filteredCoupons.map((coupon) => {
                            const isInlineEditing = editingId === coupon.id;
                            const displayCoupon = isInlineEditing ? editFormData : coupon;
                            const styles = getStatusStyles(displayCoupon.status);
                            const isMenuOpen = activeMenuId === coupon.id;
                            
                            return (
                                <div 
                                key={coupon.id} 
                                className={`group flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 ${isMenuOpen ? 'z-20 relative' : 'z-0'}`}
                                >
                            
                                    <div className={`w-full md:w-36 flex flex-col items-center justify-center p-6 relative bg-slate-50 border-b md:border-b-0 md:border-r border-dashed border-slate-300 min-h-[120px] md:min-h-auto rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none`}>
                                        
                                        <div className="hidden md:block absolute -top-3 -right-3 w-6 h-6 bg-[#FDFBF7] rounded-full z-10 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.05)]" />
                                        <div className="hidden md:block absolute -bottom-3 -right-3 w-6 h-6 bg-[#FDFBF7] rounded-full z-10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]" />
                                        <div className="md:hidden absolute -left-3 -bottom-3 w-6 h-6 bg-[#FDFBF7] rounded-full z-10" />
                                        <div className="md:hidden absolute -right-3 -bottom-3 w-6 h-6 bg-[#FDFBF7] rounded-full z-10" />

                                        <div className="text-center z-10">
                                            <div className={`text-3xl font-black ${styles.text}`}>
                                                {displayCoupon.type === 'Percentage' ? `${displayCoupon.value}%` : `₹${displayCoupon.value}`}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                OFF
                                            </div>
                                        </div>
                                    </div>

                                   
                                    <div className="flex-1 p-5 flex flex-col justify-center gap-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col gap-1 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {isInlineEditing ? (
                                                            <div className="flex items-center gap-2">
                                                                <input 
                                                                    name="code" 
                                                                    value={editFormData.code} 
                                                                    onChange={handleInlineFormChange}
                                                                    className="font-mono font-bold text-[#0f172a] text-sm border border-slate-300 rounded px-2 py-1 w-32"
                                                                />
                                                                <select 
                                                                    name="status" 
                                                                    value={editFormData.status} 
                                                                    onChange={handleInlineFormChange}
                                                                    className="text-[10px] font-bold uppercase border border-slate-300 rounded px-2 py-1"
                                                                >
                                                                    <option value="Active">Active</option>
                                                                    <option value="Scheduled">Scheduled</option>
                                                                    <option value="Expired">Expired</option>
                                                                    <option value="Deactivated">Deactivated</option>
                                                                </select>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <div 
                                                                    onClick={() => handleCopyCode(coupon.code, coupon.id)}
                                                                    className="group/code cursor-pointer flex items-center gap-2 bg-slate-100 hover:bg-[#0f172a] border border-slate-200 border-dashed rounded-lg px-3 py-1.5 transition-colors"
                                                                    title="Click to Copy"
                                                                >
                                                                    <span className="font-mono font-bold text-[#0f172a] text-sm tracking-wider group-hover/code:text-white">
                                                                        {coupon.code}
                                                                    </span>
                                                                    {copiedId === coupon.id ? 
                                                                        <Check size={14} className="text-emerald-500" /> : 
                                                                        <Copy size={14} className="text-slate-400 group-hover/code:text-slate-300" />
                                                                    }
                                                                </div>
                                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${styles.badge}`}>
                                                                    {coupon.status}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {isInlineEditing ? (
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <input 
                                                                type="date" 
                                                                name="startDate" 
                                                                value={editFormData.startDate} 
                                                                onChange={handleInlineFormChange}
                                                                className="text-xs border border-slate-300 rounded px-2 py-1"
                                                            />
                                                            <span className="text-slate-400">-</span>
                                                            <input 
                                                                type="date" 
                                                                name="endDate" 
                                                                value={editFormData.endDate} 
                                                                onChange={handleInlineFormChange}
                                                                className="text-xs border border-slate-300 rounded px-2 py-1"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            Valid: {new Date(coupon.startDate).toLocaleDateString('en-IN', {day:'numeric', month:'short'})} - {new Date(coupon.endDate).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}
                                                        </div>
                                                    )}
                                                    
                                                    {isInlineEditing && (
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <select 
                                                                name="type" 
                                                                value={editFormData.type} 
                                                                onChange={handleInlineFormChange}
                                                                className="text-xs border border-slate-300 rounded px-2 py-1"
                                                            >
                                                                <option value="Percentage">Percentage</option>
                                                                <option value="Fixed">Fixed</option>
                                                            </select>
                                                            <input 
                                                                type="number" 
                                                                name="value" 
                                                                value={editFormData.value} 
                                                                onChange={handleInlineFormChange}
                                                                className="text-xs border border-slate-300 rounded px-2 py-1 w-20"
                                                                placeholder="Value"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                   
                                                <div className="flex items-center gap-2 md:pl-6 relative">
                                                    {isSelectionMode ? (
                                                            <button 
                                                                onClick={() => handleSelectCoupon(coupon)}
                                                                disabled={coupon.status !== 'Active'}
                                                                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${coupon.status === 'Active' ? 'bg-[#0f172a] text-white hover:bg-[#D4AF37] hover:text-[#0f172a]' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
                                                            >
                                                                Apply
                                                            </button>
                                                    ) : (
                                                        <>
                                                            {isInlineEditing ? (
                                                                <div className="flex items-center gap-2">
                                                                    <button onClick={handleInlineSave} className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors">
                                                                        <Check size={18} />
                                                                    </button>
                                                                    <button onClick={handleInlineCancel} className="p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
                                                                        <X size={18} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="relative" ref={isMenuOpen ? menuRef : null}>
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActiveMenuId(isMenuOpen ? null : coupon.id);
                                                                        }}
                                                                        className={`p-2 rounded-xl transition-all ${isMenuOpen ? 'bg-slate-100 text-[#0f172a]' : 'text-slate-300 hover:text-[#0f172a] hover:bg-slate-50'}`}
                                                                    >
                                                                        <MoreHorizontal size={20} />
                                                                    </button>

                                                                    
                                                                    {isMenuOpen && (
                                                                        <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 animate-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black/5">
                                                                            <button 
                                                                                onClick={() => handleInlineEditClick(coupon)}
                                                                                className="w-full text-left px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#0f172a] flex items-center gap-3 transition-colors"
                                                                            >
                                                                                <Edit2 size={14} /> Edit
                                                                            </button>
                                                                            
                                                                          
                                                                            <button 
                                                                                onClick={() => handleToggleStatus(coupon.id, coupon.status)}
                                                                                className={`w-full text-left px-4 py-3 text-xs font-bold flex items-center gap-3 transition-colors ${coupon.status === 'Deactivated' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-500 hover:bg-slate-50'}`}
                                                                            >
                                                                                {coupon.status === 'Deactivated' ? <Power size={14} /> : <PowerOff size={14} />} 
                                                                                {coupon.status === 'Deactivated' ? 'Activate' : 'Deactivate'}
                                                                            </button>

                                                                            <div className="h-px bg-slate-100 mx-2"></div>
                                                                            <button 
                                                                                onClick={() => handleDelete(coupon.id)}
                                                                                className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                                            >
                                                                                <Trash2 size={14} /> Delete
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

      
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${styles.text.replace('text', 'bg')}`} 
                                                        style={{width: `${Math.min((coupon.used / (coupon.limit || 1)) * 100, 100)}%`}}
                                                    ></div>
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                                                    {isInlineEditing ? (
                                                        <div className="flex items-center gap-1">
                                                            <input 
                                                                type="number"
                                                                name="limit"
                                                                value={editFormData.limit}
                                                                onChange={handleInlineFormChange}
                                                                className="w-12 text-xs border border-slate-300 rounded px-1"
                                                            />
                                                            <span>Limit</span>
                                                        </div>
                                                    ) : (
                                                        `${coupon.used} / ${coupon.limit || '∞'} Used`
                                                    )}
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Tag size={32} className="text-slate-300" />
                                </div>
                                <p className="text-[#0f172a] font-bold text-lg">No coupons found</p>
                                <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

          
            <div className="h-40 w-full md:hidden shrink-0"></div>

        </div>
  
  );
};

export default DiscountCoupons;
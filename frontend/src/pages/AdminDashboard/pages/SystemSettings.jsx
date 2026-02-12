import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Clock,
  Percent,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useSystemSettings } from "../../../context/SystemSettingsContext";

/* --------------------------------------------- */

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("property");
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState({
    emails: null,
    phones: null,
  });

  const { settings, setSettings } = useSystemSettings();
  const formData = settings;

  /* ---------------- UPDATE HELPERS ---------------- */

  const updateProperty = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      property: { ...prev.property, [key]: value },
    }));
  };

  const updatePropertyArray = (key, updater) => {
    setSettings((prev) => ({
      ...prev,
      property: {
        ...prev.property,
        [key]: updater(prev.property[key] || []),
      },
    }));
  };

  const updateOperations = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      operations: { ...prev.operations, [key]: value },
    }));
  };

  const updateBilling = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      billing: { ...prev.billing, [key]: value },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1200);
  };

  /* --------------------------------------------- */

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 space-y-6"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">
            System Configuration
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500 hover:text-black">
            <RotateCcw size={14} /> Discard
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-white px-6 py-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save size={14} /> Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* SIDEBAR */}
        <div className="flex xl:flex-col gap-2 overflow-x-auto pb-2 xl:w-64">
          <NavTab
            id="property"
            label="Property"
            icon={Building2}
            active={activeTab}
            setter={setActiveTab}
          />
          <NavTab
            id="ops"
            label="Operations"
            icon={Clock}
            active={activeTab}
            setter={setActiveTab}
          />
          <NavTab
            id="finance"
            label="Billing"
            icon={Percent}
            active={activeTab}
            setter={setActiveTab}
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-white border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 md:p-8">
            <AnimatePresence mode="wait">
              {/* ---------------- PROPERTY ---------------- */}

              {activeTab === "property" && (
                <motion.div
                  key="property"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10 max-w-3xl"
                >
                  <SectionHeader
                    title="Hotel Identity"
                    desc="Official business details"
                  />

                  <PropertyField
                    label="Property Name"
                    value={formData.property.hotelName}
                    onSave={(v) => updateProperty("hotelName", v)}
                  />

                  {/* EMAILS */}
                  <EditableList
                    label="Emails"
                    data={formData.property.emails}
                    editing={editing.emails}
                    setEditing={(i) => setEditing({ ...editing, emails: i })}
                    onAdd={() =>
                      updatePropertyArray("emails", (p) => [...p, ""])
                    }
                    onUpdate={(i, v) =>
                      updatePropertyArray("emails", (p) => {
                        const c = [...p];
                        c[i] = v;
                        return c;
                      })
                    }
                    onDelete={(i) =>
                      updatePropertyArray("emails", (p) =>
                        p.filter((_, x) => x !== i),
                      )
                    }
                  />

                  {/* PHONES */}
                  <EditableList
                    label="Phones"
                    data={formData.property.phones}
                    editing={editing.phones}
                    setEditing={(i) => setEditing({ ...editing, phones: i })}
                    onAdd={() =>
                      updatePropertyArray("phones", (p) => [...p, ""])
                    }
                    onUpdate={(i, v) =>
                      updatePropertyArray("phones", (p) => {
                        const c = [...p];
                        c[i] = v;
                        return c;
                      })
                    }
                    onDelete={(i) =>
                      updatePropertyArray("phones", (p) =>
                        p.filter((_, x) => x !== i),
                      )
                    }
                  />

                  <PropertyField
                    label="Address"
                    value={formData.property.address}
                    type="textarea"
                    onSave={(v) => updateProperty("address", v)}
                  />
                </motion.div>
              )}

              {/* ---------------- OPS ---------------- */}

              {activeTab === "ops" && (
                <motion.div
                  key="ops"
                  className="grid md:grid-cols-2 gap-6 max-w-3xl"
                >
                  <InputGroup
                    label="Check In"
                    type="time"
                    value={formData.operations.checkIn}
                    onChange={(e) =>
                      updateOperations("checkIn", e.target.value)
                    }
                  />
                  <InputGroup
                    label="Check Out"
                    type="time"
                    value={formData.operations.checkOut}
                    onChange={(e) =>
                      updateOperations("checkOut", e.target.value)
                    }
                  />
                  <InputGroup
                    label="Cancellation (hrs)"
                    type="number"
                    value={formData.operations.cancelWindow}
                    onChange={(e) =>
                      updateOperations("cancelWindow", e.target.value)
                    }
                  />
                  <InputGroup
                    label="Early Fee ₹"
                    type="number"
                    value={formData.operations.earlyCheckInFee}
                    onChange={(e) =>
                      updateOperations("earlyCheckInFee", e.target.value)
                    }
                  />
                </motion.div>
              )}

              {/* ---------------- BILLING ---------------- */}

              {activeTab === "finance" && (
                <motion.div
                  key="finance"
                  className="grid md:grid-cols-2 gap-6 max-w-3xl"
                >
                  <InputGroup
                    label="GST %"
                    type="number"
                    value={formData.billing.gstRate}
                    onChange={(e) => updateBilling("gstRate", e.target.value)}
                  />
                  <InputGroup
                    label="Extra Bed ₹"
                    type="number"
                    value={formData.billing.extraBed}
                    onChange={(e) => updateBilling("extraBed", e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ------------------ UI COMPONENTS ------------------ */

function NavTab({ id, label, icon: Icon, active, setter }) {
  return (
    <button
      onClick={() => setter(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap text-xs font-bold uppercase transition
      ${active === id ? "bg-primary text-white shadow" : "bg-gray-50 hover:bg-gray-100"}`}
    >
      <Icon size={15} /> {label}
    </button>
  );
}

function SectionHeader({ title, desc }) {
  return (
    <div>
      <h3 className="font-bold uppercase text-sm">{title}</h3>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}

function InputGroup({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-500">{label}</label>
      <input {...props} className="w-full border rounded-xl px-4 py-2" />
    </div>
  );
}

function PropertyField({ label, value, onSave, type = "text" }) {
  const [edit, setEdit] = useState(false);
  const [temp, setTemp] = useState(value);

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-xs font-bold">{label}</span>
        {edit ? (
          <div className="flex gap-2">
            <button
              onClick={() => {
                onSave(temp);
                setEdit(false);
              }}
            >
              <Check size={14} />
            </button>
            <button onClick={() => setEdit(false)}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <button onClick={() => setEdit(true)}>
            <Pencil size={14} />
          </button>
        )}
      </div>

      {edit ? (
        type === "textarea" ? (
          <textarea
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="w-full border rounded-xl p-3"
          />
        ) : (
          <input
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="w-full border rounded-xl p-3"
          />
        )
      ) : (
        <div className="bg-gray-50 border rounded-xl p-3">{value}</div>
      )}
    </div>
  );
}

/* ------------ LIST EDITOR ------------ */

function EditableList({
  label,
  data,
  editing,
  setEditing,
  onAdd,
  onUpdate,
  onDelete,
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-xs font-bold">{label}</span>
        <button onClick={onAdd} className="text-accent flex gap-1 text-xs">
          <Plus size={14} /> Add
        </button>
      </div>

      {data.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={v}
            disabled={editing !== i}
            onChange={(e) => onUpdate(i, e.target.value)}
            className="flex-1 border rounded-xl px-3 py-2"
          />

          <button onClick={() => setEditing(i)}>
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(i)}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import api from "./axios";

const SystemMailSettings = () => {
  const [loading, setLoading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);

  const [formData, setFormData] = useState({
    systemHotelName: "",
    systemEmails: "",
    systemPhoneNumbers: "",
    systemAddress: "",
    logo: null
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/system-settings", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data.data;

      setFormData({
        systemHotelName: data.systemHotelName || "",
        systemEmails: data.systemEmails?.join(", ") || "",
        systemPhoneNumbers: data.systemPhoneNumbers?.join(", ") || "",
        systemAddress: data.systemAddress || "",
        logo: null
      });

      setPreviewLogo(data.logo);
    } catch (err) {
      console.log("No settings found (first time setup)");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, logo: files[0] });
      setPreviewLogo(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();

      payload.append("systemHotelName", formData.systemHotelName);
      payload.append(
        "systemEmails",
        JSON.stringify(formData.systemEmails.split(",").map(e => e.trim()))
      );
      payload.append(
        "systemPhoneNumbers",
        JSON.stringify(formData.systemPhoneNumbers.split(",").map(p => p.trim()))
      );
      payload.append("systemAddress", formData.systemAddress);

      if (formData.logo) {
        payload.append("logo", formData.logo);
      }

      await api.post("/system-settings", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("System settings saved successfully!");
      fetchSettings();
    } catch (err) {
      alert("Error saving settings");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">System Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="systemHotelName"
          placeholder="Hotel Name"
          value={formData.systemHotelName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="systemEmails"
          placeholder="Emails (comma separated)"
          value={formData.systemEmails}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="systemPhoneNumbers"
          placeholder="Phone Numbers (comma separated)"
          value={formData.systemPhoneNumbers}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="systemAddress"
          placeholder="Hotel Address"
          value={formData.systemAddress}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <div>
          <label className="block mb-2 font-medium">Hotel Logo</label>
          <input type="file" accept="image/*" onChange={handleChange} />
        </div>

        {previewLogo && (
          <img
            src={previewLogo}
            alt="Logo Preview"
            className="h-24 mt-3 rounded"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
};

export default SystemMailSettings;
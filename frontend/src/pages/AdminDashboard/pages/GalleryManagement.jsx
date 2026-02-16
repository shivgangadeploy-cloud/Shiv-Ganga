import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Trash2, X, Plus, Upload } from "lucide-react";
import api from "../../../api/api";

export default function GalleryManagement() {
  const [images, setImages] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState({ 
    file: null,
    src: "", 
    category: "rooms"
 });

 useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get("/gallery");

        const formatted = res.data.data.map((img) => ({
          id: img._id,
          src: img.imageUrl,
          category: img.category,
        }));

        setImages(formatted);
      } catch (err) {
        console.error("Failed to load gallery images", err);
      }
    };

    fetchImages();
  }, []);


  const addImage = async () => {
    if (!newImage.file) return alert("Please select an image");

    try {
      const formData = new FormData();
      formData.append("category", newImage.category); // SEND CATEGORY
      formData.append("image", newImage.file);

      const res = await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded = res.data.data;

      setImages((prev) => [
        ...prev,
        {
          id: uploaded._id,
          src: uploaded.imageUrl,
          category: newImage.category,
        },
      ]);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed");
    }

    setNewImage({ file: null, preview: "", category: "rooms" });
    setShowModal(false);
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete image");
    }
  };

  /* ---------- FILE SELECT ---------- */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewImage({
      ...newImage,
      file,
      preview: URL.createObjectURL(file),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ImagePlus className="text-gray-700" size={20} />
          <div className="text-sm font-bold uppercase tracking-widest text-gray-600">
            Gallery Management
          </div>
          <div className="h-[1px] w-8 bg-accent"></div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary px-6 py-2 text-xs flex items-center gap-2 rounded-2xl"
        >
          <Plus size={14} /> Add Image
        </button>
      </div>

      {/* GALLERY GRID */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        {images.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No images added yet.
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {images.map((img) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={img.src}
                    alt="Gallery"
                    className="h-48 w-full object-cover"
                  />

                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 text-white text-[10px] uppercase tracking-widest rounded-full">
                    {img.category}
                  </div>

                  <button
                    onClick={() => deleteImage(img.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-gray-500 hover:text-red-500 
                   opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ADD IMAGE MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-700">
                  Add Gallery Image
                </h3>
                <button onClick={() => setShowModal(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* FILE UPLOAD */}
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Upload Image
                </label>

                <label className="flex flex-col items-center justify-center gap-3 h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-accent transition-all bg-gray-50">
                  <Upload className="text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Click to choose image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {newImage.preview && (
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={newImage.preview}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}

                {/* CATEGORY */}
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Category
                  </label>
                  <select
                    value={newImage.category}
                    onChange={(e) =>
                      setNewImage({ ...newImage, category: e.target.value })
                    }
                    className="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:bg-white focus:border-accent outline-none"
                  >
                    <option value="rooms">Rooms</option>
                    <option value="balcony">Balcony</option>
                    <option value="attractions">Attractions</option>
                    <option value="activities">Activities</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={addImage}
                  className="btn-primary px-6 py-2 text-xs rounded-2xl"
                >
                  Add Image
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
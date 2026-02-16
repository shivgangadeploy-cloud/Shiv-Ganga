import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Seo from "../components/Seo";
import api from "../api/api";

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");

    // const allImages = [
    //     { src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", category: "rooms" },
    //     { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", category: "rooms" },
    //     { src: "https://imgs.search.brave.com/QAOe--oA5qCQA6585eYjUCvTqdC8QS3Rmf5jb-pLu1w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE5/OTA1MTUyNS9waG90/by9iYWxjb255LXJh/aWxpbmdzLW1hZGUt/b2YtZ2xhc3MtYW5k/LXN0YWlubGVzcy1z/dGVlbC1iZWhpbmQt/dGhlbS13aW5kb3dz/LXdpdGgtbW9kZXJu/LWJsaW5kcy5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9Nmd6/SldKQ3RPbks4Ukdp/eS0xdG5obkVmSDlW/SlV1eWpEYjB4Q1JE/NEhsTT0", category: "balcony" },
    //     { src: "https://imgs.search.brave.com/1TzTyRqA_MUOG6fepW0YKSMirWawRGN4ANPCybMx2BM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZW50/dXJ5cGx5LmNvbS9i/bG9naW1hZ2UvYmFs/Y29ueV83LmpwZWc", category: "balcony" },
    //     { src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", category: "attractions" },
    //     { src: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", category: "attractions" },
    //     { src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", category: "activities" },
    //     { src: "https://i.pinimg.com/1200x/f9/15/a3/f915a356c686516973d6b322fc8974ef.jpg", category: "activities" },
    //     { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", category: "rooms" },
    //     { src: "https://imgs.search.brave.com/COEqMItQh-GwE7YfV1zqODfKHUjo4ejOxhFHU2fUqEY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuYWRzdHRjLmNv/bS9tZWRpYS9pbWFn/ZXMvNjZkNi9iYWQy/L2Y5OTkvYzYzYi83/ZjcyLzliNmEvbWVk/aXVtX2pwZy9iYWxj/b255LWRlc2lnbi1m/b3ItdXJiYW4tbGl2/aW5nLWEtY29tcHJl/aGVuc2l2ZS1ndWlk/ZV8yMi5qcGc_MTcy/NTM0ODU2OA", category: "balcony" },
    //     { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", category: "attractions" },
    //     { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80", category: "activities" }
    // ];
    const [allImages, setAllImages] = useState([]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await api.get("/gallery");

                const formatted = res.data.data.map((img) => ({
                    src: img.imageUrl,
                    category: img.category, // GET CATEGORY
                }));

                setAllImages(formatted);
            } catch (err) {
                console.error("Failed to load gallery", err);
            }
        };

        fetchGallery();
    }, []);


  const filteredImages =
    activeFilter === "all"
      ? allImages
      : allImages.filter((img) => img.category === activeFilter);

  const filters = [
    { id: "all", label: "All" },
    { id: "rooms", label: "Rooms" },
    { id: "balcony", label: "Balcony Views" },
    { id: "attractions", label: "Local Attractions" },
    { id: "activities", label: "Activities" },
  ];

  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + filteredImages.length) % filteredImages.length,
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Seo
        title="Gallery | Shiv Ganga Hotel Rishikesh"
        description="Browse the Shiv Ganga Hotel gallery: rooms, balcony views, local attractions, and activities in Rishikesh."
        path="/gallery"
        
        image="/images/gallery-hero.webp"
      />
      {/* Hero Section */}
      {/* COMMENTED OUT ORIGINAL HERO SECTION
            <section className="relative h-[85vh] overflow-hidden bg-slate-900 w-full">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=1080&fit=crop"
                        alt="Background" 
                        className="w-full h-full object-cover blur-sm opacity-60 scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent" />
                </div>
                <div className="container mx-auto px-6 h-full relative z-10 grid lg:grid-cols-2 gap-12">
                     <div className="flex flex-col justify-center pb-16 md:pb-24 md:-ml-12 lg:-ml-20">
                        <div className="relative overflow-hidden">
                            <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 transition-all duration-1000 delay-300 opacity-100 translate-y-0">
                                <div className="text-start justify-center">
                                    <span className="text-amber-400 text-xs uppercase tracking-[0.35em] font-bold block mb-2 transition-all duration-1000 delay-500 translate-y-0 opacity-100">
                                        Hotel Shiv Ganga
                                    </span>
                                    <div className="h-1 bg-amber-400 mb-7 transition-all duration-600 delay-700 w-16" />
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-none mb-4 transition-all duration-1000 delay-900 translate-y-0 opacity-100">
                                        Our Gallery
                                    </h1>
                                    <p className="text-base md:text-lg text-gray-200 font-light leading-relaxed opacity-90 transition-all duration-1000 delay-1100 opacity-100 translate-y-0">
                                        Elegantly crafted spaces where modern luxury meets timeless comfort. <br />
                                        Each room tells a story of sophisticated design and unforgettable experiences.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            */}

            {/* NEW HERO SECTION USING FRAMER MOTION (Matching Attraction.jsx style) */}
            <section className="relative min-h-[60vh] lg:min-h-[85vh] overflow-hidden bg-slate-900 w-full flex items-center transition-all duration-500">
                {/* Background Image with Animation */}
                <div className="absolute inset-0 z-0">
                    <motion.img
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        src="/images/gallery-hero.webp"
                        alt="Background"
                        className="w-full h-full object-cover blur-[2px] opacity-50 scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
                </div>

                <div className="container mx-auto px-6 h-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-10 lg:py-0">
                    {/* Left Side Content */}
                    <div className="flex flex-col justify-center text-center lg:text-left lg:items-start max-w-2xl mx-auto lg:mx-0">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {/* Removed the Top Label to match Attraction.jsx structure exactly */}
                            
                            <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif text-white tracking-tight leading-tight mb-5 drop-shadow-lg">
                                Our <span className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-[1.2] tracking-tight drop-shadow-2xl text-accent">Gallery</span>
                            </h1>
                            
                            {/* Amber Underline - Matches Attraction.jsx */}
                            <div className="w-16 h-1 bg-amber-400 mb-6 mx-auto lg:mx-0 rounded-full" />
                            
                            <p className="text-sm md:text-base text-gray-200 font-light leading-relaxed opacity-90 max-w-lg mx-auto lg:mx-0">
                                Elegantly crafted spaces where modern luxury meets timeless comfort. <br className="hidden md:block"/>
                                Each room tells a story of sophisticated design and unforgettable experiences.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Side Image Collage */}
                    <div className="hidden lg:flex relative h-[500px] w-full justify-center items-center">
                        {/* Collage Item 1 - Top Right */}
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute top-[10%] right-[15%] w-60 h-40 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-10 rotate-6 backdrop-blur-sm"
                        >
                            <img
                                src={allImages[8]?.src || "/images/gallery-hero.webp"}
                                alt="Gallery Highlight 1"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            />
                        </motion.div>

                        {/* Collage Item 2 - Left */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="absolute top-[35%] left-[10%] w-72 h-48 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-20 -rotate-3 backdrop-blur-sm"
                        >
                            <img
                                src={allImages[5]?.src || "/images/galleryimg2.webp"}
                                alt="Gallery Highlight 2"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            />
                        </motion.div>

                        {/* Collage Item 3 - Bottom */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="absolute bottom-[20%] right-[8%] w-56 h-40 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-30 rotate-3 backdrop-blur-sm"
                        >
                            <img
                                src={allImages[6]?.src || "https://images.unsplash.com/photo-1566665797739-1674de7a421a"}
                                alt="Gallery Highlight 3"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Filter Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">

  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

    {/* Mobile scroll container */}
    <div className="
      flex gap-3
      overflow-x-auto sm:overflow-visible
      sm:flex-wrap
      sm:justify-center
      scrollbar-hide
      pb-1
    ">

      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`
            shrink-0
            px-5 sm:px-6
            py-2 sm:py-2.5
            text-sm sm:text-base
            rounded-full font-medium
            transition-all duration-300

            ${
              activeFilter === filter.id
                ? "bg-amber-400 text-slate-900 shadow-md scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
            }
          `}
        >
          {filter.label}
        </button>
      ))}

    </div>

  </div>
</div>

            {/* Gallery Grid - Uniform Layout */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                {filteredImages.length > 0 ? (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        <AnimatePresence>
                            {filteredImages?.map((img, index) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={`${img.src}-${index}`}
                                    onClick={() => openLightbox(index)}
                                    className="group relative overflow-hidden rounded-lg cursor-pointer h-72 shadow-lg hover:shadow-2xl transition-shadow duration-300"
                                >
                                    <img 
                                        src={img.src} 
                                        alt={`Gallery ${index + 1}`} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="text-sm uppercase tracking-wider font-medium capitalize">{img.category}</p>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/30 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                            <ZoomIn size={24} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No images found in this category.</p>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                    {/* Close Button */}
                    <button 
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white hover:text-amber-400 transition-colors z-50 p-2 hover:bg-white/10 rounded-full"
                    >
                        <X size={32} />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute top-6 left-6 text-white text-lg z-50">
                        <span className="font-light">{currentImage + 1}</span>
                        <span className="text-white/50 mx-2">/</span>
                        <span className="text-white/70">{filteredImages.length}</span>
                    </div>

                    {/* Previous Button */}
                    <button 
                        onClick={prevImage}
                        className="absolute left-6 text-white hover:text-amber-400 transition-colors p-3 hover:bg-white/10 rounded-full"
                    >
                        <ChevronLeft size={40} />
                    </button>

                    {/* Current Image */}
                    <div className="max-w-7xl max-h-[90vh] mx-auto px-20">
                        <img 
                            src={filteredImages[currentImage]?.src}
                            alt={`Gallery ${currentImage + 1}`}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        />
                    </div>

                    {/* Next Button */}
                    <button 
                        onClick={nextImage}
                        className="absolute right-6 text-white hover:text-amber-400 transition-colors p-3 hover:bg-white/10 rounded-full"
                    >
                        <ChevronRight size={40} />
                    </button>

                    {/* Thumbnail Strip */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-4xl px-4">
                        {filteredImages?.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImage(index)}
                                className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-all ${
                                    currentImage === index 
                                        ? 'border-amber-400 scale-110' 
                                        : 'border-white/30 hover:border-white/60'
                                }`}
                            >
                                <img 
                                    src={img.src} 
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

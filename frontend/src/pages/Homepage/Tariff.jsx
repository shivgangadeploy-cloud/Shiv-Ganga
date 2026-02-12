// // import React from "react";
// // import { motion } from "framer-motion";
// // import { ArrowRight, Info } from "lucide-react";
// // import { Link } from "react-router-dom";
// // import spa from "../../assets/homepage-images/spa.webp";
// // import lounge from "../../assets/homepage-images/lounge.webp";
// // import dinner from "../../assets/homepage-images/breakfast.webp";

// // const Tariff = () => {
// //   const container = {
// //     hidden: { opacity: 0, y: 40 },
// //     visible: {
// //       opacity: 1,
// //       y: 0,
// //       transition: {
// //         duration: 0.8,
// //         ease: "easeOut",
// //         staggerChildren: 0.2,
// //       },
// //     },
// //   };

// //   const item = {
// //     hidden: { opacity: 0, y: 20 },
// //     visible: {
// //       opacity: 1,
// //       y: 0,
// //       transition: { duration: 0.6, ease: "easeOut" },
// //     },
// //   };

// //   const PRICINGS = [
// //     {
// //       roomType: "Standard Double bedroom Non AC",
// //       ep: "Rs. 2500 + Taxes",
// //       cp: "Rs. 3000 + Taxes",
// //     },
// //     {
// //       roomType: "Deluxe double bedroom AC",
// //       ep: "Rs. 3,500 + Taxes",
// //       cp: "Rs. 4,000 + Taxes",
// //     },
// //     {
// //       roomType: "Triple bedroom AC",
// //       ep: "Rs. 4000 + Taxes",
// //       cp: "Rs. 4750 + Taxes",
// //     },
// //     {
// //       roomType: "Family four bedroom AC",
// //       ep: "Rs. 4,500 + Taxes",
// //       cp: "Rs. 5,500 + Taxes",
// //     },
// //     {
// //       roomType: "Extra Adults",
// //       ep: "Rs. 1000/-",
// //       cp: "Rs. 000/-",
// //     },
// //     {
// //       roomType: "Extra Child",
// //       ep: "Rs. 750/-",
// //       cp: "Rs. 000/-",
// //     },
// //   ];

// //   return (
// //     <section className="bg-background">
// //       <section className="relative h-[85vh] overflow-hidden bg-slate-900 w-full">
// //         <div className="absolute inset-0 z-0">
// //           <motion.img
// //             initial={{ scale: 1.2, opacity: 0 }}
// //             animate={{ scale: 1.1, opacity: 1 }}
// //             transition={{ duration: 1.5 }}
// //             // Uses the first attraction image for the background
// //             // src={attractionsData[0].image}
// //             src="https://i.pinimg.com/1200x/35/07/90/3507901c117d27d09013c1fbf4c5a474.jpg"
// //             alt="Background"
// //             className="w-full h-full object-cover blur-sm opacity-60 scale-110"
// //           />

// //           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
// //           <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent" />
// //         </div>

// //         <div className="container mx-auto px-6 h-full relative z-10 grid lg:grid-cols-2 gap-12">
// //           <div className="flex flex-col justify-center pb-16 md:pb-24 md:-ml-12 lg:-ml-20">
// //             <div className="relative overflow-hidden">
// //               <motion.div
// //                 initial={{ opacity: 0, y: 24 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 transition={{ duration: 0.6 }}
// //                 className="max-w-7xl mx-auto px-6 pt-16 pb-10"
// //               >
// //                 <motion.div
// //                   variants={container}
// //                   initial="hidden"
// //                   animate="visible"
// //                   className="text-start justify-center"
// //                 >
// //                   {/* Hotel Name */}
// //                   <motion.span
// //                     variants={item}
// //                     className="text-accent text-xs uppercase tracking-[0.35em] font-bold block  mb-2"
// //                   >
// //                     Hotel Shiv Ganga
// //                   </motion.span>

// //                   {/* Animated Divider */}
// //                   <motion.div
// //                     initial={{ width: 0 }}
// //                     animate={{ width: 64 }}
// //                     transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
// //                     className="h-1 bg-amber-400 mb-7"
// //                   />

// //                   {/* Heading */}
// //                   <motion.h1
// //                     variants={item}
// //                     className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-none mb-4"
// //                   >
// //                     Tariff Plans
// //                   </motion.h1>

// //                   {/* Description */}
// //                   <motion.p
// //                     variants={item}
// //                     className="text-base md:text-lg text-gray-200 font-light leading-relaxed opacity-90 md:whitespace-nowrap"
// //                   >
// //                     Transparent pricing for comfortable stays. <br />
// //                     Choose EP (Room Only) or CP (Room + Breakfast) as per your
// //                     preference.
// //                   </motion.p>
// //                 </motion.div>
// //               </motion.div>
// //             </div>
// //           </div>

// //           <div className="hidden lg:block relative h-full w-full">
// //             <motion.div
// //               initial={{ y: -50, opacity: 0 }}
// //               animate={{ y: 0, opacity: 1 }}
// //               transition={{ delay: 0.5, duration: 0.8 }}
// //               className="absolute top-[15%] right-[5%] w-72 h-48 rounded-2xl overflow-hidden border-[6px] border-white/20 shadow-2xl z-10 rotate-3 backdrop-blur-sm"
// //             >
// //               <img
// //                 src={spa}
// //                 alt="Collage 1"
// //                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
// //               />
// //             </motion.div>

// //             <motion.div
// //               initial={{ x: -50, opacity: 0 }}
// //               animate={{ x: 0, opacity: 1 }}
// //               transition={{ delay: 0.7, duration: 0.8 }}
// //               className="absolute top-[35%] left-[5%] w-80 h-60 rounded-2xl overflow-hidden border-[6px] border-white/20 shadow-2xl z-20 -rotate-2 backdrop-blur-sm"
// //             >
// //               <img
// //                 src={lounge}
// //                 alt="Collage 2"
// //                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
// //               />
// //             </motion.div>

// //             <motion.div
// //               initial={{ y: 50, opacity: 0 }}
// //               animate={{ y: 0, opacity: 1 }}
// //               transition={{ delay: 0.9, duration: 0.8 }}
// //               className="absolute bottom-[20%] right-[15%] w-64 h-56 rounded-2xl overflow-hidden border-[6px] border-white/20 shadow-2xl z-30 rotate-6 backdrop-blur-sm"
// //             >
// //               <img
// //                 src={dinner}
// //                 alt="Collage 3"
// //                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
// //               />
// //             </motion.div>
// //           </div>
// //         </div>
// //       </section>

// //       <div className="max-w-7xl mx-auto px-6 py-24">
// //         <motion.div
// //           initial={{ opacity: 0, y: 16 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.6 }}
// //           className="hidden md:block bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
// //         >
// //           <div className="bg-[#0f2a45] text-white">
// //             <div className="grid grid-cols-3">
// //               <div className="px-6 py-5 text-center font-bold uppercase tracking-widest text-sm">
// //                 Room Type
// //               </div>
// //               <div className="px-6 py-5 text-center font-bold uppercase tracking-widest text-sm">
// //                 EP
// //               </div>
// //               <div className="px-6 py-5 text-center font-bold uppercase tracking-widest text-sm">
// //                 CP
// //               </div>
// //             </div>
// //           </div>

// //           <div>
// //             {PRICINGS.map((row, idx) => (
// //               <div
// //                 key={row.roomType}
// //                 className={`grid grid-cols-3 ${
// //                   idx % 2 === 0 ? "bg-gray-50" : "bg-white"
// //                 } border-t border-gray-100`}
// //               >
// //                 <div className="px-6 py-5 text-center text-primary font-medium">
// //                   {row.roomType}
// //                 </div>
// //                 <div className="px-6 py-5 text-center text-primary">
// //                   {row.ep}
// //                 </div>
// //                 <div className="px-6 py-5 text-center text-primary">
// //                   {row.cp}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </motion.div>

// //         <motion.div
// //           initial={{ opacity: 0, y: 24 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.6 }}
// //           className="md:hidden space-y-4"
// //         >
// //           {PRICINGS.map((row, idx) => (
// //             <div
// //               key={row.roomType}
// //               className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-lg"
// //             >
// //               <div className="px-5 py-4 bg-gray-50">
// //                 <h3 className="text-primary font-serif text-lg">
// //                   {row.roomType}
// //                 </h3>
// //               </div>
// //               <div className="px-5 py-4 grid grid-cols-2 gap-4">
// //                 <div>
// //                   <div className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
// //                     EP
// //                   </div>
// //                   <div className="text-primary font-medium">{row.ep}</div>
// //                 </div>
// //                 <div>
// //                   <div className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
// //                     CP
// //                   </div>
// //                   <div className="text-primary font-medium">{row.cp}</div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </motion.div>

// //         <motion.div
// //           initial={{ opacity: 0 }}
// //           whileInView={{ opacity: 1 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.6, delay: 0.1 }}
// //           className="mt-10 bg-accent/10 border border-accent/20 rounded-2xl p-6"
// //         >
// //           <div className="flex items-start gap-3 text-primary">
// //             <Info className="text-accent mt-[2px]" size={18} />
// //             <div className="text-sm">
// //               - Taxes extra as applicable.
// //               <br />- EP: Room Only • CP: Room with Breakfast.
// //             </div>
// //           </div>
// //         </motion.div>

// //         <motion.div
// //           initial={{ opacity: 0, y: 8 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.6 }}
// //           className="mt-12 text-center"
// //         >
// //           <Link
// //             to="/booking"
// //             className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-2xl group"
// //           >
// //             Book Your Stay
// //             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
// //           </Link>
// //         </motion.div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default Tariff;




// import React from "react";
// import { motion } from "framer-motion";
// import { ArrowRight, Info } from "lucide-react";
// import { Link } from "react-router-dom";
// import spa from "../../assets/homepage-images/spa.webp";
// import lounge from "../../assets/homepage-images/lounge.webp";
// import dinner from "../../assets/homepage-images/breakfast.webp";

// const Tariff = () => {
//   const container = {
//     hidden: { opacity: 0, y: 40 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.8,
//         ease: "easeOut",
//         staggerChildren: 0.2,
//       },
//     },
//   };

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.6, ease: "easeOut" },
//     },
//   };

//   const PRICINGS = [
//     {
//       roomType: "Standard Double bedroom Non AC",
//       ep: "Rs. 2500 + Taxes",
//       cp: "Rs. 3000 + Taxes",
//     },
//     {
//       roomType: "Deluxe double bedroom AC",
//       ep: "Rs. 3,500 + Taxes",
//       cp: "Rs. 4,000 + Taxes",
//     },
//     {
//       roomType: "Triple bedroom AC",
//       ep: "Rs. 4000 + Taxes",
//       cp: "Rs. 4750 + Taxes",
//     },
//     {
//       roomType: "Family four bedroom AC",
//       ep: "Rs. 4,500 + Taxes",
//       cp: "Rs. 5,500 + Taxes",
//     },
//     {
//       roomType: "Extra Adults",
//       ep: "Rs. 1000/-",
//       cp: "Rs. 000/-",
//     },
//     {
//       roomType: "Extra Child",
//       ep: "Rs. 750/-",
//       cp: "Rs. 000/-",
//     },
//   ];

//   return (
//     <section className="bg-background">
//       {/* ORIGINAL HERO SECTION COMMENTED OUT */}
//       {/* <section className="relative h-[85vh] overflow-hidden bg-slate-900 w-full">
//         <div className="absolute inset-0 z-0">
//           <motion.img
//             initial={{ scale: 1.2, opacity: 0 }}
//             animate={{ scale: 1.1, opacity: 1 }}
//             transition={{ duration: 1.5 }}
//             // Uses the first attraction image for the background
//             // src={attractionsData[0].image}
//             src="https://i.pinimg.com/1200x/35/07/90/3507901c117d27d09013c1fbf4c5a474.jpg"
//             alt="Background"
//             className="w-full h-full object-cover blur-sm opacity-60 scale-110"
//           />

//           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
//           <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent" />
//         </div>

//         <div className="container mx-auto px-6 h-full relative z-10 grid lg:grid-cols-2 gap-12">
//           <div className="flex flex-col justify-center pb-16 md:pb-24 md:-ml-12 lg:-ml-20">
//             <div className="relative overflow-hidden">
//               <motion.div
//                 initial={{ opacity: 0, y: 24 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 className="max-w-7xl mx-auto px-6 pt-16 pb-10"
//               >
//                 <motion.div
//                   variants={container}
//                   initial="hidden"
//                   animate="visible"
//                   className="text-start justify-center"
//                 >
                  
//                   <motion.span
//                     variants={item}
//                     className="text-accent text-xs uppercase tracking-[0.35em] font-bold block  mb-2"
//                   >
//                     Hotel Shiv Ganga
//                   </motion.span>

                 
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: 64 }}
//                     transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
//                     className="h-1 bg-amber-400 mb-7"
//                   />

                  
//                   <motion.h1
//                     variants={item}
//                     className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-none mb-4"
//                   >
//                     Tariff Plans
//                   </motion.h1>

                 
//                   <motion.p
//                     variants={item}
//                     className="text-base md:text-lg text-gray-200 font-light leading-relaxed opacity-90 md:whitespace-nowrap"
//                   >
//                     Transparent pricing for comfortable stays. <br />
//                     Choose EP (Room Only) or CP (Room + Breakfast) as per your
//                     preference.
//                   </motion.p>
//                 </motion.div>
//               </motion.div>
//             </div>
//           </div>

//           <div className="hidden lg:block relative h-full w-full">
//             <motion.div
//               initial={{ y: -50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.5, duration: 0.8 }}
//               className="absolute top-[15%] right-[5%] w-72 h-48 rounded-2xl overflow-hidden border-[6px] border-white/20 shadow-2xl z-10 rotate-3 backdrop-blur-sm"
//             >
//               <img
//                 src={spa}
//                 alt="Collage 1"
//                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
//               />
//             </motion.div>

//             <motion.div
//               initial={{ x: -50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.7, duration: 0.8 }}
//               className="absolute top-[35%] left-[5%] w-80 h-60 rounded-2xl overflow-hidden border-[6px] border-white/20 shadow-2xl z-20 -rotate-2 backdrop-blur-sm"
//             >
//               <img
//                 src={lounge}
//                 alt="Collage 2"
//                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
//               />
//             </motion.div>

//             <motion.div
//               initial={{ y: 50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.9, duration: 0.8 }}
//               className="absolute bottom-[20%] right-[15%] w-64 h-56 rounded-2xl overflow-hidden border-[6px] border-white/20 shadow-2xl z-30 rotate-6 backdrop-blur-sm"
//             >
//               <img
//                 src={dinner}
//                 alt="Collage 3"
//                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
//               />
//             </motion.div>
//           </div>
//         </div>
//       </section> 
//       */}

//       {/* NEW HERO SECTION */}
//       <section className="relative min-h-[60vh] lg:min-h-[85vh] overflow-hidden bg-slate-900 w-full flex items-center transition-all duration-500">
//         {/* Background Image with Animation */}
//         <div className="absolute inset-0 z-0">
//           <motion.img
//             initial={{ scale: 1.2, opacity: 0 }}
//             animate={{ scale: 1.1, opacity: 1 }}
//             transition={{ duration: 1.5 }}
//             src="https://i.pinimg.com/1200x/35/07/90/3507901c117d27d09013c1fbf4c5a474.jpg"
//             alt="Background"
//             className="w-full h-full object-cover blur-[2px] opacity-50 scale-110"
//           />

//           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
//           <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
//         </div>

//         <div className="container mx-auto px-6 h-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-10 lg:py-0">
//           {/* Left Side Content */}
//           <div className="flex flex-col justify-center text-center lg:text-left lg:items-start max-w-2xl mx-auto lg:mx-0">
//             <motion.div
//               initial={{ y: 30, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               <span className="text-amber-400 text-xs uppercase tracking-[0.35em] font-bold block mb-2">
//                 Hotel Shiv Ganga
//               </span>
//               <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif text-white tracking-tight leading-tight mb-5 drop-shadow-lg">
//                 Tariff Plans
//               </h1>
//               <div className="w-16 h-1 bg-amber-400 mb-6 mx-auto lg:mx-0 rounded-full" />
//               <p className="text-sm md:text-base text-gray-200 font-light leading-relaxed opacity-90 max-w-lg mx-auto lg:mx-0">
//                 Transparent pricing for comfortable stays. <br />
//                 Choose EP (Room Only) or CP (Room + Breakfast) as per your
//                 preference.
//               </p>
//             </motion.div>
//           </div>

//           {/* Right Side Image Collage */}
//           <div className="hidden lg:flex relative h-[500px] w-full justify-center items-center">
//             {/* Collage Item 1 - Top Right */}
//             <motion.div
//               initial={{ y: -50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.5, duration: 0.8 }}
//               className="absolute top-[10%] right-[15%] w-60 h-40 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-10 rotate-6 backdrop-blur-sm"
//             >
//               <img
//                 src={spa}
//                 alt="Spa"
//                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
//               />
//             </motion.div>

//             {/* Collage Item 2 - Left */}
//             <motion.div
//               initial={{ x: -50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.7, duration: 0.8 }}
//               className="absolute top-[35%] left-[10%] w-72 h-48 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-20 -rotate-3 backdrop-blur-sm"
//             >
//               <img
//                 src={lounge}
//                 alt="Lounge"
//                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
//               />
//             </motion.div>

//             {/* Collage Item 3 - Bottom */}
//             <motion.div
//               initial={{ y: 50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.9, duration: 0.8 }}
//               className="absolute bottom-[20%] right-[8%] w-56 h-40 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl z-30 rotate-3 backdrop-blur-sm"
//             >
//               <img
//                 src={dinner}
//                 alt="Dinner"
//                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
//               />
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       <div className="max-w-7xl mx-auto px-6 py-24">
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="hidden md:block bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
//         >
//           <div className="bg-[#0f2a45] text-white">
//             <div className="grid grid-cols-3">
//               <div className="px-6 py-5 text-center font-bold uppercase tracking-widest text-sm">
//                 Room Type
//               </div>
//               <div className="px-6 py-5 text-center font-bold uppercase tracking-widest text-sm">
//                 EP
//               </div>
//               <div className="px-6 py-5 text-center font-bold uppercase tracking-widest text-sm">
//                 CP
//               </div>
//             </div>
//           </div>

//           <div>
//             {PRICINGS.map((row, idx) => (
//               <div
//                 key={row.roomType}
//                 className={`grid grid-cols-3 ${
//                   idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//                 } border-t border-gray-100`}
//               >
//                 <div className="px-6 py-5 text-center text-primary font-medium">
//                   {row.roomType}
//                 </div>
//                 <div className="px-6 py-5 text-center text-primary">
//                   {row.ep}
//                 </div>
//                 <div className="px-6 py-5 text-center text-primary">
//                   {row.cp}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="md:hidden space-y-4"
//         >
//           {PRICINGS.map((row, idx) => (
//             <div
//               key={row.roomType}
//               className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-lg"
//             >
//               <div className="px-5 py-4 bg-gray-50">
//                 <h3 className="text-primary font-serif text-lg">
//                   {row.roomType}
//                 </h3>
//               </div>
//               <div className="px-5 py-4 grid grid-cols-2 gap-4">
//                 <div>
//                   <div className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
//                     EP
//                   </div>
//                   <div className="text-primary font-medium">{row.ep}</div>
//                 </div>
//                 <div>
//                   <div className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
//                     CP
//                   </div>
//                   <div className="text-primary font-medium">{row.cp}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.1 }}
//           className="mt-10 bg-accent/10 border border-accent/20 rounded-2xl p-6"
//         >
//           <div className="flex items-start gap-3 text-primary">
//             <Info className="text-accent mt-[2px]" size={18} />
//             <div className="text-sm">
//               - Taxes extra as applicable.
//               <br />- EP: Room Only • CP: Room with Breakfast.
//             </div>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 8 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="mt-12 text-center"
//         >
//           <Link
//             to="/booking"
//             className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-2xl group"
//           >
//             Book Your Stay
//             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//           </Link>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Tariff;


import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import spa from "../../assets/homepage-images/spa.webp";
import lounge from "../../assets/homepage-images/lounge.webp";
import dinner from "../../assets/homepage-images/breakfast.webp";
import Seo from "../../components/Seo";

const Tariff = () => {
  const PRICINGS = [
    {
      roomType: "Standard Double bedroom Non AC",
      ep: "Rs. 2500 + Taxes",
      cp: "Rs. 3000 + Taxes",
    },
    {
      roomType: "Deluxe double bedroom AC",
      ep: "Rs. 3,500 + Taxes",
      cp: "Rs. 4,000 + Taxes",
    },
    {
      roomType: "Triple bedroom AC",
      ep: "Rs. 4000 + Taxes",
      cp: "Rs. 4750 + Taxes",
    },
    {
      roomType: "Family four bedroom AC",
      ep: "Rs. 4,500 + Taxes",
      cp: "Rs. 5,500 + Taxes",
    },
    {
      roomType: "Extra Adults",
      ep: "Rs. 1000/-",
      cp: "Rs. 000/-",
    },
    {
      roomType: "Extra Child",
      ep: "Rs. 750/-",
      cp: "Rs. 000/-",
    },
  ];

  return (
    <section className="bg-background">
      <Seo
        title="Tariff | Shiv Ganga Hotel Rishikesh"
        description="Room tariff plans at Shiv Ganga Hotel: EP and CP options for Standard, Deluxe, Triple, and Family rooms."
        path="/tariff"
      />
      {/* ORIGINAL HERO SECTION COMMENTED OUT 
      <section className="relative h-[85vh] overflow-hidden bg-slate-900 w-full">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="https://i.pinimg.com/1200x/35/07/90/3507901c117d27d09013c1fbf4c5a474.jpg"
            alt="Background"
            className="w-full h-full object-cover blur-sm opacity-60 scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent" />
        </div>
        // ... (Old content omitted for brevity)
      </section> 
      */}

      {/* NEW HERO SECTION (Matching Attraction/Gallery Style) */}
      <section className="relative min-h-[60vh] lg:min-h-[85vh] overflow-hidden bg-slate-900 w-full flex items-center transition-all duration-500">
        {/* Background Image with Animation */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="https://i.pinimg.com/1200x/35/07/90/3507901c117d27d09013c1fbf4c5a474.jpg"
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
              {/* Removed Top Label "Hotel Shiv Ganga" to match Attraction.jsx structure */}
              
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif text-white tracking-tight leading-tight mb-5 drop-shadow-lg">
                Tariff <span className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-[1.2] tracking-tight drop-shadow-2xl text-accent">Plans</span>
              </h1>
              
              {/* Amber Divider - Matches Attraction.jsx */}
              <div className="w-16 h-1 bg-amber-400 mb-6 mx-auto lg:mx-0 rounded-full" />
              
              <p className="text-sm md:text-base text-gray-200 font-light leading-relaxed opacity-90 max-w-lg mx-auto lg:mx-0">
                Transparent pricing for comfortable stays. <br className="hidden md:block"/>
                Choose EP (Room Only) or CP (Room + Breakfast) as per your
                preference.
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
                src={spa}
                alt="Spa"
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
                src={lounge}
                alt="Lounge"
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
                src={dinner}
                alt="Dinner"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="hidden md:block bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
        >
          <div className="bg-[#0f2a45] text-white">
            <div className="grid grid-cols-3">
              <div className="px-6 py-5 text-center font-bold uppercase tracking-widest text-sm">
                Room Type
              </div>
              <div className="px-6 py-5 text-center font-bold uppercase tracking-widest text-sm">
                EP
              </div>
              <div className="px-6 py-5 text-center font-bold uppercase tracking-widest text-sm">
                CP
              </div>
            </div>
          </div>

          <div>
            {PRICINGS.map((row, idx) => (
              <div
                key={row.roomType}
                className={`grid grid-cols-3 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-t border-gray-100`}
              >
                <div className="px-6 py-5 text-center text-primary font-medium">
                  {row.roomType}
                </div>
                <div className="px-6 py-5 text-center text-primary">
                  {row.ep}
                </div>
                <div className="px-6 py-5 text-center text-primary">
                  {row.cp}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:hidden space-y-4"
        >
          {PRICINGS.map((row, idx) => (
            <div
              key={row.roomType}
              className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-lg"
            >
              <div className="px-5 py-4 bg-gray-50">
                <h3 className="text-primary font-serif text-lg">
                  {row.roomType}
                </h3>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
                    EP
                  </div>
                  <div className="text-primary font-medium">{row.ep}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
                    CP
                  </div>
                  <div className="text-primary font-medium">{row.cp}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 bg-accent/10 border border-accent/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3 text-primary">
            <Info className="text-accent mt-[2px]" size={18} />
            <div className="text-sm">
              - Taxes extra as applicable.
              <br />- EP: Room Only • CP: Room with Breakfast.
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            to="/booking"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-2xl group"
          >
            Book Your Stay
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Tariff;

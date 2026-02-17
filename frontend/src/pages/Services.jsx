import { Utensils, Wifi, Car, Coffee, Waves, Dumbbell, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Seo from "../components/Seo";

export default function Services() {
    const services = [
        {
            icon: <Utensils size={40} />,
            title: "Gourmet Dining",
            description: "Experience a culinary journey with our world-class chefs serving authentic local and international cuisine."
        },
        {
            icon: <Waves size={40} />,
            title: "Luxury Spa",
            description: "Rejuvenate your senses with our exclusive spa treatments, massages, and wellness therapies."
        },
        {
            icon: <Dumbbell size={40} />,
            title: "Fitness Center",
            description: "Stay fit with our state-of-the-art gym equipment and personal training sessions."
        },
        {
            icon: <Wifi size={40} />,
            title: "High-Speed Wi-Fi",
            description: "Stay connected with complimentary high-speed internet access throughout the hotel."
        },
        {
            icon: <Car size={40} />,
            title: "Chauffeur Service",
            description: "Travel in style with our premium chauffeur services for airport transfers and city tours."
        },
        {
            icon: <Shield size={40} />,
            title: "24/7 Security",
            description: "Your safety is our priority with round-the-clock security and surveillance."
        },
        {
            icon: <Coffee size={40} />,
            title: "In-Room Dining",
            description: "Enjoy delicious meals in the comfort of your room with our 24-hour room service."
        },
        {
            icon: <Clock size={40} />,
            title: "Concierge Service",
            description: "Our dedicated concierge team is available 24/7 to assist with all your needs and requests."
        }
    ];

    return (
        <div className="bg-background min-h-screen">
            <Seo
                title="Services & Amenities | Shiv Ganga Hotel"
                description="World-class amenities including gourmet dining, spa, fitness center, Wi-Fi, chauffeur service, and concierge."
                path="/services"
            />
            <div className="bg-primary py-32 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <span className="text-accent text-sm uppercase tracking-[0.3em] font-medium block mb-4">Our Services</span>
                    <h1 className="text-5xl md:text-6xl font-serif mb-6">World-Class Amenities</h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4 font-light leading-relaxed">
                        We go above and beyond to ensure your stay is comfortable, convenient, and memorable.
                    </p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-10 rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 border border-gray-100"
                        >
                            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-serif text-primary mb-4 group-hover:text-accent transition-colors">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* LOCAL ATTRACTIONS */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                     <div className="text-center mb-16">
                        <span className="text-accent text-sm uppercase tracking-[0.3em] font-medium block mb-4">Explore Rishikesh</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-primary">Local Attractions</h2>
                        <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                            Enhance your stay with these unforgettable local experiences. 
                            You can add these activities directly to your booking.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { title: "River Rafting", price: "$50", desc: "Experience the thrill of the Ganges rapids.", img: "https://images.unsplash.com/photo-1530933469436-766929802c24?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
                            { title: "Bungee Jumping", price: "$80", desc: "India's highest bungee jumping platform.", img: "https://images.unsplash.com/photo-1521330784804-16e660429713?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
                            { title: "Ganga Aarti", price: "Free", desc: "Spiritual evening ceremony by the river.", img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
                            { title: "Yoga Session", price: "$30", desc: "Find peace in the Yoga Capital of the World.", img: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img src={item.img} alt={item.title || "Hotel Shiv Ganga service"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                                        {item.price}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-serif text-primary mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

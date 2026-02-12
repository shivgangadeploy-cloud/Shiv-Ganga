import { Tag, Calendar, Gift } from "lucide-react";
import Seo from "../components/Seo";

export default function Offers() {
    const offers = [
        {
            title: "Early Bird Special",
            discount: "20% OFF",
            description: "Book 30 days in advance and enjoy 20% off on your stay. Includes complimentary breakfast.",
            icon: <Calendar size={32} />
        },
        {
            title: "Weekend Getaway",
            discount: "15% OFF",
            description: "Escape the city for the weekend! Get 15% off on Friday and Saturday night stays.",
            icon: <Tag size={32} />
        },
        {
            title: "Honeymoon Package",
            discount: "Special",
            description: "Celebrate love with our romantic package including candle-light dinner, room decoration, and spa.",
            icon: <Gift size={32} />
        }
    ];

    return (
        <div className="bg-background min-h-screen">
            <Seo
                title="Special Offers | Shiv Ganga Hotel"
                description="Exclusive hotel deals: early bird, weekend getaways, and honeymoon packages at Shiv Ganga Hotel."
                path="/offers"
            />
            <div className="bg-primary py-24 text-center text-white">
                <h1 className="text-5xl font-serif mb-4">Special Offers</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4">
                    Exclusive deals and packages designed to make your stay even more rewarding.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {offers.map((offer, index) => (
                        <div key={index} className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-background rounded-full text-accent mb-6 group-hover:bg-accent group-hover:text-primary transition-colors">
                                {offer.icon}
                            </div>
                            <h3 className="text-2xl font-serif text-primary mb-2">{offer.title}</h3>
                            <span className="inline-block bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                                {offer.discount}
                            </span>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                {offer.description}
                            </p>
                            <button className="w-full border border-primary text-primary py-3 uppercase tracking-widest text-sm font-medium hover:bg-primary hover:text-white transition-colors">
                                Book This Offer
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

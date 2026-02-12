import { Calendar, Users, ChevronDown } from "lucide-react";

export default function BookingForm() {
    return (
        <form className="bg-white p-8 rounded-sm shadow-2xl grid md:grid-cols-4 gap-6 items-end border-t-4 border-accent relative z-10 -mt-10 mx-4 md:mx-auto max-w-6xl">
            <div className="flex flex-col space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-medium">Check In</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-accent w-4 h-4" />
                    <input type="date" className="w-full border border-gray-200 pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-accent transition-colors text-sm uppercase" />
                </div>
            </div>
            
            <div className="flex flex-col space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-medium">Check Out</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-accent w-4 h-4" />
                    <input type="date" className="w-full border border-gray-200 pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-accent transition-colors text-sm uppercase" />
                </div>
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-medium">Guests</label>
                <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-accent w-4 h-4" />
                    <select className="w-full border border-gray-200 pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-accent transition-colors text-sm appearance-none bg-white">
                        <option>1 Adult</option>
                        <option>2 Adults</option>
                        <option>2 Adults, 1 Child</option>
                        <option>3+ Guests</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
            </div>

            <button className="bg-accent hover:bg-accent-hover text-primary font-bold py-3 px-6 rounded-sm transition-all duration-300 uppercase tracking-widest h-[46px] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Check Availability
            </button>
        </form>
    );
}

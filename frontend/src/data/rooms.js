import {
  Wifi,
  Tv,
  Coffee,
  Wind,
  Shield,
  Users,
  Droplets,
  Sofa,
  BookOpen,
  Mountain,
  Bath,
  ParkingCircle,
  Leaf,
  VolumeX,
} from "lucide-react";
import room1 from "../assets/homepage-images/room1.webp";
import room2 from "../assets/homepage-images/room2.webp";
import room3 from "../assets/homepage-images/room3.webp";
import room4 from "../assets/homepage-images/room4.webp";
import room5 from "../assets/homepage-images/room5.webp";
import room6 from "../assets/homepage-images/room6.webp";
import room7 from "../assets/homepage-images/room7.webp";
import room8 from "../assets/homepage-images/room8.webp";
import room9 from "../assets/homepage-images/room9.webp";
import room10 from "../assets/homepage-images/room10.webp";
import room11 from "../assets/homepage-images/room11.webp";
import room12 from "../assets/homepage-images/room12.webp";
import room13 from "../assets/homepage-images/room13.webp";
import room14 from "../assets/homepage-images/room14.webp";
import room15 from "../assets/homepage-images/room15.webp";
import room16 from "../assets/homepage-images/room16.webp";
import room17 from "../assets/homepage-images/room17.webp";
import room18 from "../assets/homepage-images/room18.webp";


export const rooms = [
  {
    id: "Single Bedroom",
    name: "Single Bedroom",
    price: "₹ 1,499",
    size: "28 m²",
    occupancy: "2 Adults",
    capacity: 2,
    extraCharges: { adult: 0, child: 0 },
    rating: 4.6,
    reviews: 124,
    image:
      room1,
    images: [
      room1,
      room2,
      room3,
    ],
    description:
      "A comfortable non-AC room designed for restful sleep and simple comfort in the heart of Rishikesh.",
    features: [
      { icon: Wind, label: "Non-AC" },
      { icon: Users, label: "2 Guests" },
      { icon: Wifi, label: "Free Wi‑Fi" },
      { icon: Droplets, label: "Hot Water" },
      { icon: Shield, label: "24h Service" },
      { icon: Tv, label: "LED TV" },
    ],
    amenities: [
      "Non-AC",
      "Queen Bed",
      "Free Wi‑Fi",
      "Hot Water",
      "24h Service",
      "LED TV",
    ],
  },
  {
    id: "deluxe-double-ac",
    name: "Deluxe Double AC",
    price: "₹ 2,899",
    size: "34 m²",
    occupancy: "2 Adults",
    capacity: 2,
    extraCharges: { adult: 0, child: 0 },
    rating: 4.8,
    reviews: 162,
    image:
      room4,
    images: [
      room4,
      room5,
      room6,
    ],
    description:
      "A premium AC room with refined interiors, upgraded comforts, and a calm vibe for a better stay.",
    features: [
      { icon: Wind, label: "Full AC" },
      { icon: Users, label: "2 Guests" },
      { icon: Shield, label: "Air Purifier" },
      { icon: Coffee, label: "Tea/Coffee" },
      { icon: Sofa, label: "Mini Fridge" },
      { icon: Leaf, label: "Breakfast" },
    ],
    amenities: [
      "Full AC",
      "King Bed",
      "Air Purifier",
      "Tea/Coffee",
      "Mini Fridge",
      "Breakfast",
    ],
  },
  {
    id: "executive-triple",
    name: "Executive Triple",
    price: "₹ 3,499",
    size: "42 m²",
    occupancy: "3 Adults",
    capacity: 3,
    extraCharges: { adult: 0, child: 0 },
    rating: 4.7,
    reviews: 98,
    image:
      room7,
    images: [
      room7,
      room8,
      room9,
    ],
    description:
      "A spacious triple room ideal for friends and small families, offering extra space and thoughtful conveniences.",
    features: [
      { icon: Users, label: "3 Adults" },
      { icon: Sofa, label: "Seating" },
      { icon: Shield, label: "Room Safe" },
      { icon: Wifi, label: "Free Wi‑Fi" },
      { icon: Tv, label: "LED TV" },
      { icon: Mountain, label: "Porter" },
    ],
    amenities: [
      "3 Adults",
      "Spacious",
      "Extra Space",
      "Seating",
      "Room Safe",
      "Porter",
    ],
  },
  {
    id: "Single AC Room",
    name: "Single AC Room",
    price: "₹ 2,199",
    size: "30 m²",
    occupancy: "2 Adults",
    capacity: 2,
    extraCharges: { adult: 0, child: 0 },
    rating: 4.9,
    reviews: 76,
    image:
      room10,
    images: [
      room10,
      room11,
      room12,
    ],
    description:
      "A calm, quiet space for mindful travellers—crafted for comfort, silence, and spiritual rest.",
    features: [
      { icon: Leaf, label: "Zen Zone" },
      { icon: VolumeX, label: "Soundproof" },
      { icon: Users, label: "2 Guests" },
      { icon: BookOpen, label: "Library" },
      { icon: Mountain, label: "Quiet Policy" },
      { icon: Leaf, label: "Natural Decor" },
    ],
    amenities: [
      "Zen Zone",
      "Soundproof",
      "Yoga Mat",
      "Quiet Policy",
      "Library",
      "Natural Decor",
    ],
  },
  {
    id: "Delux River View Room",
    name: "Delux River View Room",
    price: "₹ 3,999",
    size: "40 m²",
    occupancy: "2 Adults",
    capacity: 2,
    extraCharges: { adult: 0, child: 0 },
    rating: 4.8,
    reviews: 64,
    image:
      room13,
    images: [
      room13,
      room14,
      room15,
    ],
    description:
      "A top-floor room with private balcony vibes—perfect for fresh air, views, and a premium unwind.",
    features: [
      { icon: Mountain, label: "Peak Views" },
      { icon: Wind, label: "Top Floor" },
      { icon: Bath, label: "Luxury Tub" },
      { icon: Shield, label: "Smart Controls" },
      { icon: Wifi, label: "Free Wi‑Fi" },
      { icon: Users, label: "2 Guests" },
    ],
    amenities: [
      "Private Balcony",
      "Top Floor",
      "Peak Views",
      "Balcony",
      "Luxury Tub",
      "Smart Controls",
    ],
  },
  {
    id: "grand-family-suite",
    name: "Grand Family Suite",
    price: "₹ 4,999",
    size: "62 m²",
    occupancy: "4+ Guests",
    capacity: 4,
    extraCharges: { adult: 0, child: 0 },
    rating: 4.9,
    reviews: 53,
    image:
      room16,
    images: [
      room16,
      room17,
      room18,
    ],
    description:
      "A large family suite with lounge comfort, warm lighting, and room to relax together.",
    features: [
      { icon: Users, label: "4+ Guests" },
      { icon: Sofa, label: "Lounge Area" },
      { icon: Shield, label: "VIP Welcome" },
      { icon: Leaf, label: "Designer Lights" },
      { icon: ParkingCircle, label: "Free Parking" },
      { icon: Wifi, label: "Free Wi‑Fi" },
    ],
    amenities: [
      "4+ Guests",
      "Lounge Area",
      "VIP Welcome",
      "Designer Lights",
      "Free Parking",
      "Family Friendly",
    ],
  },
];

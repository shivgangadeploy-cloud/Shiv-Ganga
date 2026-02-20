import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },


    type: {
      type: String,
      enum: ["Standard", "Deluxe", "Triple", "Family"],
      required: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Single Bedroom",
        "Deluxe Double AC",
        "Exclusive Triple",
        "Single AC Room",
        "Deluxe River View Room",
        "Grand Family Suite"
      ]
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    pricePerNight: {
      type: Number,
      required: true
    },

    roomSize: {
      type: String,
      required: true
    },

    capacityAdults: {
      type: Number,
      required: true,
      min: 1
    },

    capacityChildren: {
      type: Number,
      default: 0
    },

    features: {
      type: [String],
      default: []
    },

    mainImage: {
      type: String,
      required: true
    },

    gallery: {
      type: [String],
      default: []
    },
   
    status: {
      type: String,
      enum: ["Available", "Maintenance"],
      default: "Available"
    },

    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
  checkInTime: {
    type: String,
    default: "15:00"
  },

  checkOutTime: {
    type: String,
    default: "12:00"
  },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
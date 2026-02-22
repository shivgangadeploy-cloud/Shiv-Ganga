import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    rooms: [
      {
        room: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        plan: {
          type: String,
          default: "ep",
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    checkInDate: {
      type: Date,
      required: true,
    },
    guestId: {
      type: String,
      unique: true,
      required: true,
    },
    bookingReference: {
      type: String,
      default: null,
    },

    checkOutDate: {
      type: Date,
      required: true,
    },

    adults: {
      type: Number,
      required: true,
      min: 1,
    },

    children: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    checkedInAt: {
      type: Date,
      default: null,
    },

    checkedOutAt: {
      type: Date,
      default: null,
    },

    isCheckedIn: {
      type: Boolean,
      default: false,
    },

    isCheckedOut: {
      type: Boolean,
      default: false,
    },
    paymentType: {
      type: String,
      enum: ["FULL", "PARTIAL"],
      default: "FULL",
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    pendingAmount: {
      type: Number,
      default: 0,
    },
    coupon: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
    id: {
      type: String,
    },

    idDocument: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    addOns: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    extraBeds: {
      count: {
        type: Number,
        default: 0,
      },
      pricePerBed: {
        type: Number,
        default: 0,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
    },
    fine: {
      amount: { type: Number, default: 0 },
      reason: String,
      status: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING",
      },
    },
  },
  { timestamps: true },
);

//INDEX (important for lookup)
bookingSchema.index({ "rooms.room": 1, checkInDate: 1, checkOutDate: 1 });


//PREVENT OVERLAPPING BOOKINGS
bookingSchema.pre("save", async function () {

  if (!this.rooms || this.rooms.length === 0) return;

  if (this.checkInDate) {
    this.checkInDate.setHours(0, 0, 0, 0);
  }

  if (this.checkOutDate) {
    this.checkOutDate.setHours(0, 0, 0, 0);
  }

  for (const r of this.rooms) {
    const overlapping = await mongoose.model("Booking").findOne({
      "rooms.room": r.room,
      bookingStatus: "confirmed",
      isCheckedOut: false,
      checkInDate: { $lt: this.checkOutDate },
      checkOutDate: { $gt: this.checkInDate },
      _id: { $ne: this._id }
    });

    if (overlapping) {
      throw new Error("Room already booked for selected dates");
    }
  }
});

export default mongoose.model("Booking", bookingSchema);
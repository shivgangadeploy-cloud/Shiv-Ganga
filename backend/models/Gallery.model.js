import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true
    },
    
    category: {
      type: String,
      enum: ["rooms", "balcony", "attractions", "activities"],
      required: true,
    }, //SAVE CATEGORY

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
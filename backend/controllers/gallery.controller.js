// import Gallery from "../models/Gallery.model.js";
// import { uploadToCloudinary } from "../services/cloudinary.service.js";

// /* ================= ADD IMAGE (ADMIN) ================= */
// export const addGalleryImage = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Image file is required"
//       });
//     }

//     const upload = await uploadToCloudinary(
//       req.file,
//       "hotel/gallery"
//     );

//     const image = await Gallery.create({
//       imageUrl: upload.secure_url,
//       uploadedBy: req.user._id
//     });

//     res.status(201).json({
//       success: true,
//       message: "Image uploaded successfully",
//       data: image
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* ================= GET ALL IMAGES (PUBLIC) ================= */
// export const getGalleryImages = async (req, res, next) => {
//   try {
//     const images = await Gallery.find()
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: images.length,
//       data: images
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* ================= DELETE IMAGE (ADMIN) ================= */
// export const deleteGalleryImage = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const image = await Gallery.findById(id);
//     if (!image) {
//       return res.status(404).json({
//         success: false,
//         message: "Image not found"
//       });
//     }

//     await image.deleteOne();

//     res.json({
//       success: true,
//       message: "Image deleted successfully"
//     });
//   } catch (error) {
//     next(error);
//   }
// };

import Gallery from "../models/Gallery.model.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

/* ================= ADD IMAGE (ADMIN) ================= */
export const addGalleryImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    const upload = await uploadToCloudinary(
      req.file,
      "hotel/gallery"
    );

    const image = await Gallery.create({
      imageUrl: upload.secure_url,
      category: req.body.category, // SAVE CATEGORY
      uploadedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: image
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL IMAGES (PUBLIC) ================= */
export const getGalleryImages = async (req, res, next) => {
  try {
    const images = await Gallery.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE IMAGE (ADMIN) ================= */
export const deleteGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found"
      });
    }

    await image.deleteOne();

    res.json({
      success: true,
      message: "Image deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
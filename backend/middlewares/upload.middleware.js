import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only images and PDF files are allowed"
      ),
      false
    );
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter
});

import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../config/env.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

// Use Memory Storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

export const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "recipe-app", // Optional: organize in a folder
    });

    // Attach the Cloudinary URL to the request object
    req.file.cloudinaryUrl = result.secure_url;
    req.file.public_id = result.public_id;

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Image upload failed" });
  }
};

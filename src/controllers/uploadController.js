export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Use the Cloudinary URL attached by the middleware
    const imageUrl = req.file.cloudinaryUrl;

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

// Subir una imagen

const uploadImage = async (img: any, type: string, username: string) => {
  let folder;

  switch (type) {
    case "avatar":
      folder = "Avatares";
      break;
    case "portada":
      folder = "Portadas";
      break;
    default:
      folder = "Imagenes";
      break;
  }

  try {
    const result = await cloudinary.uploader.upload(img, {
      folder: folder,
      upload_preset: "zend_preset",
      public_id: `${username}-${type}-${Date.now()}`,
      allowed_formats: [
        "png",
        "jpg",
        "jpeg",
        "svg",
        "ico",
        "jfif",
        "webp",
        "avif",
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.log("Error uploading image to Cloudinary:", error);
    throw new Error("Error uploading image to Cloudinary");
  }
};

export { cloudinary, uploadImage };

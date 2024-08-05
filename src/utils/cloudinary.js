import { Cloudinary } from "cloudinary-core";

const cloudinary = new Cloudinary({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  const uploadResponse = await cloudinary.uploader.upload(file, {
    folder: "senseteach",
  });
  
  console.log(uploadResponse);
  return uploadResponse.secure_url;
};

export const deleteImage = async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
};

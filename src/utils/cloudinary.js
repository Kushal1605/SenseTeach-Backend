import { Cloudinary } from "cloudinary-core";
import fs from "fs";

const cloudinary = new Cloudinary({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file) => {
  try {
    if (!file?.trim())
      throw new ReferenceError("File not found or does not exists.");

    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: "senseteach",
      secure_url: true,
    });

    console.log("Upload response: ", uploadResponse);
    fs.unlinkSync(file);
    return uploadResponse.secure_url;
  } catch (err) {
    if (err instanceof ReferenceError) {
      console.log(err);
    } else {
      fs.unlinkSync(file);
      console.log(
        "Something went wrong while uploading file to cloudinary",
        err
      );
    }

    return null;
  }
};

export const deleteFromCloudinary = async (url) => {
  try {
    if (!url?.trim()) throw new ReferenceError("Invalid url or url not found.");

    console.log("url")
    const splitUrl = url.split("/");
    const publicId = splitUrl.slice(-2)[0] + "/" + splitUrl.slice(-1)[0];
    console.log(publicId);

    const deleteResponse = await cloudinary.uploader.destroy(publicId);
    console.log(deleteResponse);
    return deleteResponse;
  } catch (err) {
    console.log(
      "Something went wrong while deleting file from cloudinary",
      err
    );
  }
};

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadToCloudinary = async (file) => {
  try {
    if (!file?.trim())
      throw new ReferenceError("File not found or does not exists.");

    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: "senseteach",
      secure_url: true,
    });

    fs.unlinkSync(file);

    return uploadResponse.secure_url;
  } catch (err) {
    if (err instanceof ReferenceError) {
      console.log("File not found.", err);
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

    const splitUrl = url.split("/");
    const publicId =
      splitUrl.slice(-2)[0] +
      "/" +
      splitUrl.slice(-1)[0].substring(0, splitUrl.slice(-1)[0].length - 4);

    const deleteResponse = await cloudinary.uploader.destroy(publicId);
    return deleteResponse;
  } catch (err) {
    console.log(
      "Something went wrong while deleting file from cloudinary",
      err
    );
  }
};

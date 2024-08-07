import asyncWrapper from "../utils/asyncWrapper.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token."
    );
  }
};

export const registerUser = asyncWrapper(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  if ([username, fullName, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All feilds are required.");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (user) {
    throw new ApiError(409, "User already exists.");
  }

  const localAvatarPath = req.file.avatar;
  if (!localAvatarPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadToCloudinary(localAvatarPath);
  if (!avatar)
    throw new ApiError(
      500,
      "Something went wrong while uploading avatar to cloudinary."
    );

  const newUser = await User.create({
    username,
    fullName,
    email,
    password,
    avatar,
  }).select("-password");

  res
    .status(201)
    .json(new ApiResponse(201, newUser, "User created successfully."));
});

export const loginUser = asyncWrapper(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "Username or email is required.");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist with given username or email");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const isCorrectPassword = await user.isCorrectPassword(password);
  if (!isCorrectPassword) {
    throw new ApiError(401, "Incorrect Credentials.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user
  );

  const modifiedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: modifiedUser, accessToken, refreshToken },
        "User logged in successfully."
      )
    );
});

export const logoutUser = asyncWrapper(async (req, res) => {
  const user = req.user;
  user.refreshToken = "";

  await user.save({ validateBeforeSave: false });
  const options = {
    httpOnly: true,
    secure: true
  }

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(204, {}, "User logged out successfully."));
});

export const getCurrentUser = asyncWrapper(async (req, res) => {
  const user = req.user;

  res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully."));
});

export const getUserById = asyncWrapper(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User id is required.");
  }

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User does not exist with the given Id");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully."));
});

export const refreshAccessToken = asyncWrapper(async (req, res) => {
  const clientRefreshToken =
    req.cookies?.refreshToken ||
    req.body.refreshToken ||
    req.header("Authorization").replace("Bearer ", "");

  if (!clientRefreshToken) {
    throw new ApiError(400, "Refresh token is required.");
  }

  const decodedClientRefreshToken = jwt.verify(
    clientRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedClientRefreshToken?.id);

  if (!user) {
    throw new ApiError(404, "User does not exist with the given Id");
  }

  if (user.refreshToken !== clientRefreshToken) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully."
      )
    );
});

export const updateUserProfile = asyncWrapper(async (req, res) => {
  const { fullName, email, contact } = req.body;
  const fieldsToBeUpdated = {};

  if (fullName) {
    fieldsToBeUpdated.fullName = fullName;
  }

  if (email) {
    fieldsToBeUpdated.email = email;
  }

  if (contact) {
    fieldsToBeUpdated.contact = contact;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: fieldsToBeUpdated },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User profile updated successfully.")
    );
});

export const updateUserAvatar = asyncWrapper(async (req, res) => {
  const localAvatarPath = req.file.avatar;

  if (!localAvatarPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadToCloudinary(localAvatarPath);
  if (!avatar) {
    throw new ApiError(
      500,
      "Something went wrong while uploading avatar to cloudinary."
    );
  }

  const modifiedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar } },
    { new: true }
  ).select("-password refreshToken");

  res
    .status(200)
    .json(
      new ApiResponse(200, modifiedUser, "User avatar updated successfully.")
    );
});

export const updateUserPassword = asyncWrapper(async (req, res) => {
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    throw new ApiError(400, "Password and new password are required.");
  }

  const user = req.user;
  const isCorrectPassword = await user.isCorrectPassword(password);

  if (!isCorrectPassword) {
    throw new ApiError(401, "Incorrect Old Password.");
  }

  const modifiedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { password: newPassword } },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(
      new ApiResponse(200, modifiedUser, "User password updated successfully.")
    );
});

export const getUserJoinedClasses = asyncWrapper(async (req, res) => {
  const joinedClasses = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "classes",
        localField: "joinedClasses",
        foreignField: "_id",
        as: "joinedClasses",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                    email: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              name: 1,
              code: 1,
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
        ],
      },
    },
    {
      $unwind: "$joinedClasses",
    },
    {
      $project: {
        _id: 0,
        joinedClasses: 1,
        username: 1,
        fullName: 1,
        avatar: 1,
      },
    },
  ]);

  if (!joinedClasses) {
    throw new ApiError(404, "No joined classes found.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        joinedClasses,
        "Joined classes fetched successfully."
      )
    );
});

export const getUserCreatedClasses = asyncWrapper(async (req, res) => {
  const createdClasses = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "classes",
        localField: "createdClasses",
        foreignField: "_id",
        as: "createdClasses",
        pipeline: [
          {
            $addFields: {
              studentCount: {
                $size: "$student.length",
              },
            },
          },
          {
            $project: {
              name: 1,
              code: 1,
              owner: 1,
              studentCount: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$createdClasses",
    },
    {
      $project: {
        createdClasses: 1,
        username: 1,
        fullName: 1,
        avatar: 1,
      },
    },
  ]);
});

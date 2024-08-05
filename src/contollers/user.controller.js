import asyncWrapper from "../utils/asyncWrapper.js";
import { User } from "../models/user.model";

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    await user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while generating accessToken and refreshToken: \n${error}`
    );
  }
};

const registerUser = asyncWrapper(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  if ([username, fullName, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All feilds are required.");
  }

  const localAvatarPath = req.file.avatar;
  
});

const loginUser = asyncWrapper(async (req, res) => {});
const getCurrentUser = asyncWrapper(async (req, res) => {});
const getUserById = asyncWrapper(async (req, res) => {});
const updateUserProfile = asyncWrapper(async (req, res) => {});
const refreshAccessToken = asyncWrapper(async (req, res) => {});
const getUserJoinedClasses = asyncWrapper(async (req, res) => {});
const getUserCreatedClasses = asyncWrapper(async (req, res) => {});

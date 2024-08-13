import jwt from "jsonwebtoken";
import asyncWrapper from "../utils/asyncWrapper.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncWrapper(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new ApiError(401, "Unauthorized request.");
  }

  const decodedAccessToken = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );

  const currentUser = await User.findById(decodedAccessToken?.id).select(
    "-password"
  );

  if (!currentUser) {
    throw new ApiError(401, "Invalid access token.");
  }

  req.user = currentUser;
  next();
});

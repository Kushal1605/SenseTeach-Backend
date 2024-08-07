import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  getUserCreatedClasses,
  getUserJoinedClasses,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAvatar,
  updateUserPassword,
	updateUserProfile,
} from "../contollers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router
	.route("/register")
	.post(upload.single("avatar"), registerUser);

router
	.route("/login")
	.post(loginUser);

// secured routes
router
	.route("/get-user")
	.get(verifyJWT, getCurrentUser);

router
	.route("/get-user/:userId")
	.get(verifyJWT, getUserById);

router
	.route("/logout")
	.post(verifyJWT, logoutUser);

router
	.route("/refresh-token")
	.post(verifyJWT, refreshAccessToken);


router
	.route("/update-profile")
	.patch(verifyJWT, updateUserProfile);

router
	.route("/update-avatar")
	.patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
  
router
	.route("/update-password")
	.patch(verifyJWT, updateUserPassword);

router
	.route("/joined")
	.get(verifyJWT, getUserJoinedClasses);

router
	.route("/created")
	.get(verifyJWT, getUserCreatedClasses);

export default router;

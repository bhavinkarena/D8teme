import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createUser,
  getCurrentUser,
  updateUserDetails,
} from "../controllers/userprofile.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const userprofileRouter = Router();

userprofileRouter.route("/userprofile/createuser").post(
  verifyJWT, upload.array('profileImage'),createUser
);
userprofileRouter
  .route("/userprofile/updateuser")
  .put(verifyJWT, updateUserDetails);
userprofileRouter.route("/userprofile/profile").get(verifyJWT, getCurrentUser);

userprofileRouter.post(
  "/userprofile/addimg",
  upload.array("photos"),
  (req, res) => {
    const uploadedFiles = req.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }
    const fileDetails = uploadedFiles.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      destination: file.destination,
    }));
    res.status(200).json({
      success: true,
      message: "Files uploaded successfully.",
      files: fileDetails
    });
    console.log("fileDetails:", fileDetails);
  }
);

export default userprofileRouter;

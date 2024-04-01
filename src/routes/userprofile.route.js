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
  verifyJWT,
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),
  createUser
);
userprofileRouter
  .route("/userprofile/updateuser")
  .put(verifyJWT, updateUserDetails);
userprofileRouter.route("/userprofile/profile").get(verifyJWT, getCurrentUser);


export default userprofileRouter;

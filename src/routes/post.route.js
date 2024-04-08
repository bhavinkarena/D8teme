import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  uploadPost,
} from "../controllers/post.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const postRouter = Router();

postRouter.route("/post/createpost").post(verifyJWT ,upload.fields([
    {
      name: "post",
      maxCount: 1,
    },
  ]),uploadPost);

export default postRouter;
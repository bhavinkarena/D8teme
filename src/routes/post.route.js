import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  countComment,
  countLikes,
  getAllPostsByHashtag,
  likePost,
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

postRouter.route("/post/getallpost").post(verifyJWT,getAllPostsByHashtag);
postRouter.route("/post/likepost/:postId").post(verifyJWT,likePost);
postRouter.route("/post/countlike/:postId").get(verifyJWT,countLikes);
postRouter.route("/post/countcomment/:postId").get(verifyJWT,countComment);

export default postRouter;
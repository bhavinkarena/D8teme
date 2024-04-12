import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  countCommentLike,
  createComment,
  createReply,
  likeComment,
} from "../controllers/comment.controller.js";
const commentRouter = Router();

commentRouter.route("/comment/createcomment/:postId").post(verifyJWT, createComment);
commentRouter.route("/comment/replaycomment/:commentId").post(verifyJWT, createReply);
commentRouter.route("/comment/likecomment/:commentId").get(verifyJWT, likeComment);
commentRouter.route("/comment/countcommentlike/:commentId").get(verifyJWT, countCommentLike);

export default commentRouter;
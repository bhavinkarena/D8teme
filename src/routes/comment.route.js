import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createComment,
  createReply,
} from "../controllers/comment.controller.js";
const commentRouter = Router();

commentRouter.route("/comment/createcomment/:postId").post(verifyJWT, createComment);
commentRouter.route("/comment/replaycomment/:commentId").post(verifyJWT, createReply);

export default commentRouter;
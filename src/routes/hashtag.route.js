import { Router } from "express";
import { addHashtag } from "../controllers/hashtag.controller.js";

const hashRouter = Router();

hashRouter.route("/hashtag/addhash").post(addHashtag);

export default hashRouter;

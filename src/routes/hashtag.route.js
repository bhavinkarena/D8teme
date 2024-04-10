import { Router } from "express";
import { addHashtag, getAllPassionHashtag, getAllPostHashtag } from "../controllers/hashtag.controller.js";

const hashRouter = Router();

hashRouter.route("/hashtag/addhash").post(addHashtag);
hashRouter.route("/hashtag/passion").get(getAllPassionHashtag);
hashRouter.route("/hashtag/post").get(getAllPostHashtag);
// hashRouter.route("/hashtag/add").get(addDefaultHashtags);

export default hashRouter;

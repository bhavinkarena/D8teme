import { Router } from "express";
import { addHashtag,allPassions } from "../controllers/hashtag.controller.js";

const hashRouter = Router();

hashRouter.route("/hashtag/addhash").post(addHashtag);
hashRouter.route("/hashtag/allpassions").get((req, res) => 
{res.json({ passions: allPassions });
});

export default hashRouter;

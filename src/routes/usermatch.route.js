import { Router } from "express";
import { acceptRequest, blockUser, getFriendsList, getPendingList, rejectRequest, sendRequest } from "../controllers/usermatch.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const requestRouter = Router();

requestRouter.route("/request/send").post(verifyJWT,sendRequest);
requestRouter.route("/request/accept").post(verifyJWT,acceptRequest);
requestRouter.route("/request/reject").post(verifyJWT,rejectRequest);
requestRouter.route("/request/friendlist").get(verifyJWT,getFriendsList);
requestRouter.route("/request/pendinglist").get(verifyJWT,getPendingList);
requestRouter.route("/request/blockuser").delete(verifyJWT,blockUser);

export default requestRouter;
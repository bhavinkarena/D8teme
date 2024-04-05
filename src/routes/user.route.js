import { Router } from "express";
import {
  isPhoneNumberValid,
  isValidate,
  // isValidateLink,
  loginUser,
  logoutUser,
  registerUser,
  // sendLinkMail,
  verifyEmail,
  verifyPhoneNumber,
} from "../controllers/user.controller.js";
import passport from "passport";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/user/register").post(registerUser);
userRouter.route("/user/login").post(loginUser);
userRouter.route("/user/verifyEmail").get(verifyJWT, verifyEmail);
userRouter.route("/user/validateemail").get(verifyJWT, isValidate);
userRouter.route("/user/logout").get(verifyJWT, logoutUser);
// userRouter.route("/user/verifylink").get(verifyJWT,sendLinkMail)
// userRouter.route("/user/validatelink").get(isValidate,isValidateLink)
userRouter.route("/user/verifyPhoneNumber").post(verifyJWT, verifyPhoneNumber);
userRouter.route("/user/isPhoneNumberValid").get(verifyJWT, isPhoneNumberValid);

userRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

userRouter.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);

userRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/user/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

export default userRouter;

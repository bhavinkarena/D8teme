import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import {
  facebookPassport,
  googlePassport,
} from "./controllers/user.controller.js";

// Import routes
import UserRouter from "./routes/user.route.js";
import userprofileRouter from "./routes/userprofile.route.js";
import hashRouter from "./routes/hashtag.route.js";
import requestRouter from "./routes/usermatch.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";

const app = express();

// Middleware
app.use(express.static("public"));
app.use(cors({
  origin: "*", // Allow requests from any origin
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Session middleware
app.use(
  session({
    secret: "bhavinkarena",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and configure strategies
app.use(passport.initialize());
app.use(passport.session());
googlePassport(passport);
facebookPassport(passport);

// Routes
app.get("/", (req, res) => {
  res.send("D8teme");
});
app.use("/api/v1", UserRouter);
app.use("/api/v2", userprofileRouter);
app.use("/api/v3", hashRouter);
app.use("/api/v4", requestRouter);
app.use("/api/v5", postRouter);
app.use("/api/v6", commentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

export { app };

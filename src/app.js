import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import { facebookPassport, googlePassport } from "./controllers/user.controller.js";

const app = express();

app.get("/",(req,res)=>{
    res.send("D8teme")
})

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));


  // app.use((req, res, next) => {
  //   // Set CORS headers
  //   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow requests from any origin
  //   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specified HTTP methods
  //   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specified headers
  //   next();
  // });

app.use(
    session({
      secret: 'bhavinkarena',
      resave: false,
      saveUninitialized: false,
    })
);

app.use(express.static("public"))   
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

googlePassport(passport);
facebookPassport(passport);

app.use(passport.initialize());
app.use(passport.session());

//user routes import
import UserRouter from './routes/user.route.js'
app.use("/api/v1", UserRouter)
//userProfile routes import
import userprofileRouter from "./routes/userprofile.route.js"
app.use("/api/v2",userprofileRouter)
//hashtag route import
import hashRouter from "./routes/hashtag.route.js"
app.use("/api/v3",hashRouter)
//request route import
import requestRouter from "./routes/usermatch.route.js"
app.use("/api/v4",requestRouter)
//post route import
import postRouter from "./routes/post.route.js"
app.use("/api/v5",postRouter)
//comment route import
import commentRouter from "./routes/comment.route.js"
app.use("/api/v6",commentRouter)

export { app };

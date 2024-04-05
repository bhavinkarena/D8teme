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

googlePassport(passport);
facebookPassport(passport);

app.use(express.static("public"))   
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const origins = [
    "http://192.168.50.245",
    "http://192.168.50.245:8000",
    "http://127.0.0.1",
    "http://localhost",
    "https://d8teme.onrender.com",
    "http://localhost:3000"
];

app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(origins.indexOf(origin) === -1){
          var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(
    session({
      secret: 'bhavinkarena',
      resave: false,
      saveUninitialized: false,
    })
);

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

export { app };

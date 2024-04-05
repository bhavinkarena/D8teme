import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import sendEmail from "../middlewares/verify_email.js";
import sendSMS from "../middlewares/verify_phone.js";
// import sendLink from "../middlewares/verify_email.js"
import { Strategy as FacebookStrategy } from "passport-facebook";
// import { v4 as uuidv4 } from "uuid";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Check if any field is empty
  if (
    [email, password, confirmPassword].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const existedEmp = await User.findOne({ email });

  if (existedEmp) {
    throw new ApiError(
      409,
      "Employee with email or phone number already exists"
    );
  }

  const user = await User.create({
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the Employee"
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res.json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
      },
      "User register successfully"
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select("-password");

  return res.json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
      },
      "User logged in successfully"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "User not authenticated"));
  }
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshtoken: 1 },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new ApiResponse(200, {}, "User logout succsessfully"));
});

const googlePassport = asyncHandler(async (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5050/api/v1/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Save the Google ID and email in the database
          let user = await User.findOne({ google_id: profile.id });
          if (!user) {
            user = await User.create({
              google_id: profile.id,
              email: profile.emails[0].value,
              valid_email: true,
            });
            await generateAccessAndRefereshTokens(user._id);
          }
          done(null, user);
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    )
  );

  // Used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Used to deserialize the user
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
});

const facebookPassport = asyncHandler(async (passport) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_SECRET_KEY,
        callbackURL: "http://localhost:5050/api/v1/facebook/callback",
        scope: ["email"],
        profileFields: ["id", "displayName", "emails"],
      },
      async function (accessToken, refreshToken, profile, cb) {
        try {
          console.log(profile);
          const user = await User.findOne({ facebook_id: profile.id});
          if (!user) {
            console.log("Adding new Facebook user to DB..");
            const newUser = new User({
              facebook_id: profile.id,
              email: profile.emails ? profile.emails[0].value : null,
              valid_email: true,
            });
            await newUser.save();
            return cb(null, newUser);
          } else {
            console.log("Facebook User already exists in DB..");
            return cb(null, user);
          }
        } catch (err) {
          console.error(err);
          return cb(err, null);
        }
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(async function (id, cb) {
    const user = await User.findById(id);
    cb(null, user);
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the OTP in the database
    user.otp = otp;
    user.otpExpiration = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
    await user.save();

    // Send the OTP email
    sendEmail(user.email, otp);

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error validating email:", error);
    throw new ApiError(500, "Internal server error");
  }
});

const isValidate = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  const usercheck = await User.findOne({ _id: user._id });

  if (!usercheck) {
    throw new ApiError(404, "User not found");
  }

  if (parseInt(otp) === parseInt(usercheck.otp)) {
    // Clear the OTP in the database
    usercheck.otp = undefined;
    usercheck.otpExpiration = undefined;
    usercheck.valid_email = true;
    await usercheck.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          usercheck,
        },
        "User logged in successfully"
      )
    );
  } else {
    throw new ApiError(400, "Invalid OTP");
  }
});


const verifyPhoneNumber = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save the OTP in the database
  user.phone = phone;
  user.otp = otp;
  user.otpExpiration = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
  await user.save();

  await sendSMS(phone, otp);

  return res.json({ message: "OTP sent successfully" });
});

const isPhoneNumberValid = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = req.user;

  // Find the user in the database
  const usercheck = await User.findOne({ _id: user._id });

  // Validate the OTP
  if (usercheck && parseInt(otp) === parseInt(usercheck.otp)) {
    // Clear the OTP in the database
    usercheck.otp = undefined;
    usercheck.otpExpiration = undefined;
    usercheck.valid_phone = true;
    await usercheck.save();
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          usercheck,
        },
        "User phone number verified successfully"
      )
    );
  }

  throw new ApiError(400, "Invalid Phone Number OTP");
});


export {
  registerUser,
  loginUser,
  verifyEmail,
  isValidate,
  googlePassport,
  facebookPassport,
  logoutUser,
  isPhoneNumberValid,
  verifyPhoneNumber,
};

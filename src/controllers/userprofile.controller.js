import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserProfile } from "../models/userprofile.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUser = asyncHandler(async (req, res) => {
  try {
    if (req.user.valid_email === true) {
      const userID = req.user._id;
      const {
        firstname,
        lastname,
        DOB,
        gender,
        show_me,
        member_status,
        last_online_time,
        height,
        body_type,
        bio_video_url,
        bio_content,
      } = req.body;
      const user = await User.findOne(req.user._id);
      const existedUser = await UserProfile.findOne({
        $or: [{ email: user.email }],
      });

      if (existedUser) {
        throw new ApiError(
          409,
          "Employee with email or phone number already exists"
        );
      }
      let flag = false;
      let coverImageLocalPath;
      if (
        req.files &&
        Array.isArray(req.files.profileImage) &&
        req.files.profileImage.length > 0
      ) {
        coverImageLocalPath = req.files.profileImage[0].path;
      } else {
        flag = true;
        coverImageLocalPath = path.join(
          __dirname,
          "..",
          "static",
          "profile.jpg"
        );
      }

      const profileimage = await uploadOnCloudinary(coverImageLocalPath, flag);
      const userprofile = await UserProfile.create({
        userID,
        firstname,
        lastname,
        DOB,
        profileImage: profileimage?.url || "",
        email: user.email,
        gender,
        show_me,
        member_status,
        last_online_time,
        height,
        body_type,
        bio_video_url,
        bio_content,
      });
      const createdUser = await UserProfile.findById(userprofile._id).select();

      if (!createdUser) {
        throw new ApiError(
          500,
          "Something went wrong while registering the Employee"
        );
      }

      return res
        .status(201)
        .json(
          new ApiResponse(200, createdUser, "Employee registered Successfully")
        );
    } else {
      throw new ApiError(401, "Please verify your Email by OTP");
    }
  } catch (error) {
    throw new ApiError(400, error);
  }
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const {
    firstname,
    lastname,
    DOB,
    gender,
    show_me,
    member_status,
    last_online_time,
    height,
    body_type,
    bio_video_url,
    bio_content,
  } = req.body;
  //    console.log(req.body);
  const userID = await UserProfile.find({ userID: req.user._id });
  const user = await UserProfile.findByIdAndUpdate(
    userID[0]._id,
    {
      $set: {
        firstname: firstname,
        lastname: lastname,
        DOB: DOB,
        gender: gender,
        show_me: show_me,
        member_status: member_status,
        last_online_time: last_online_time,
        height: height,
        body_type: body_type,
        bio_video_url: bio_video_url,
        bio_content: bio_content,
      },
    },
    { new: true }
  ).select();
  console.log(user);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (req.user.valid_email === true) {
    const userID = await UserProfile.find({ userID: req.user._id });
    const currentUser = await UserProfile.findById(userID[0]._id).select(
      "firstname lastname email profileImage DOB gender show_me member_status height last_online_time body_type bio_video_url bio_content"
    );
    if(!currentUser){
      throw new ApiError(400,"User not Found")
    }
    return res
      .status(200)
      .json(new ApiResponse(200, currentUser, "Employee fetched successfully"));
  } else {
    throw new ApiError(401, "Please verify your Email by OTP");
  }
});

export { createUser, updateUserDetails, getCurrentUser };

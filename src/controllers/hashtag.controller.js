import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Hashtag } from "../models/hashtag.model.js";

const addHashtag = asyncHandler(async (req, res) => {
  const { hashtag, type } = req.body;

  const existedHash = await Hashtag.findOne({ hashtag, type });
  if (existedHash) {
    throw new ApiError(409, "This hashtag already exists");
  }

  const newHashtag = await Hashtag.create({ hashtag, type });
  if (!newHashtag) {
    throw new ApiError(500, "Something went wrong while adding the hashtag");
  }

  return res.status(201).json(new ApiResponse(200, newHashtag, "Hashtag added successfully"));
});

const getAllPostHashtag = asyncHandler(async (req, res) => {
  const postHashtags = await Hashtag.find({ type: "post" }).select("hashtag -_id");
  let post_array = []
  for (let i = 0; i < postHashtags.length; i++) {
    post_array.push(postHashtags[i].hashtag)
  }
  return res.json(post_array);
});

const getAllPassionHashtag = asyncHandler(async (req, res) => {
  const userHashtags = await Hashtag.find({ type: "passion" }).select("hashtag -_id");
  let passion_array = []
  for (let i = 0; i < userHashtags.length; i++) {
    passion_array.push(userHashtags[i].hashtag)
  }
  return res.json(passion_array);
});


export { addHashtag, getAllPostHashtag, getAllPassionHashtag };

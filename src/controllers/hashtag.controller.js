import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Hashtag } from "../models/hashtag.model.js";

const addHashtag = asyncHandler(async (req, res) => {
    const hashtag = req.body;
  
    const existedHash = await Hashtag.findOne(hashtag);
    if (existedHash) {
      throw new ApiError(
        409,
        "This hashtag is already exists"
      );
    }
  
    const hash = await Hashtag.create(hashtag);
    const createdHash = await Hashtag.findById(hash._id).select();
    console.log(createdHash);
    if (!createdHash) {
      throw new ApiError(
        500,
        "Something went wrong while adding the Hashtag"
      );
    }
  
    return res
      .status(201)
      .json(
        new ApiResponse(200, createdHash, "Hashtag added Successfully 👍")
      );
});

export {addHashtag}
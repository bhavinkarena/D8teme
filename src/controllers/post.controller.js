import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {Post} from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadPost = async (req, res) => {
    try {
      const { userId } = req.user;
      const { hashtags } = req.body;
  
      // Upload the file on Cloudinary
      let path = req.files.post[0].path;
      const cloudinaryResponse = await uploadOnCloudinary(path);
  
      if (!cloudinaryResponse) {
        return res.status(500).json(new ApiError(500, null, "Something went wrong while uploading the file"));
      }
  
      // Create a new post object
      const newPost = new Post({
        userId,
        hashtags,
        post: cloudinaryResponse.url, // save the Cloudinary URL of the uploaded file
      });
  
      // Save the new post object in the database
      await newPost.save();
  
      // Return a success response
      res.json(
        new ApiResponse(200, newPost, "Post Upload Successful 👍")
      );
    } catch (error) {
      console.error("Error uploading post:", error);
      return res.status(500).json(new ApiError(500, error, "Internal Server Error"));
    }
};
  
const getAllPostsByHashtag = asyncHandler(async (req, res) => {
  try {
    const { hashtag } = req.body;

    // Find all posts with the specified hashtag
    const posts = await Post.find({ hashtags: hashtag });

    // Return the posts
    res.json(new ApiResponse(200, posts, "Posts Retrieved Successfully"));
  } catch (error) {
    console.error("Error retrieving posts by hashtag:", error);
    return res.status(500).json(new ApiError(500, error, "Internal Server Error"));
  }
});

export { uploadPost, getAllPostsByHashtag };
  
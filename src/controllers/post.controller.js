import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {Post} from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { UserProfile } from "../models/userprofile.model.js";

const uploadPost = async (req, res) => {
    try {
      const userId = req.user;
      const { hashtags } = req.body;
  
      // Upload the file on Cloudinary
      let post = req.files.post[0].path;
      const cloudinaryResponse = await uploadOnCloudinary(post);
  
      if (!cloudinaryResponse) {
        return res.status(500).json(new ApiError(500, null, "Something went wrong while uploading the file"));
      }
      console.log(userId);
      // Create a new post object
      const newPost = new Post({
        userId: userId,
        hashtags: hashtags,
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
  
const getAllPostsByHashtag = async (req, res) => {
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
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params; // Assuming postId is passed as a URL parameter
    const userId = req.user;
    
    const userprofile = await UserProfile.find({ userID: userId });

    // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json(new ApiError(404, null, "Post not found"));
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userprofile[0]._id)) {
      return res.status(400).json(new ApiError(400, null, "You have already liked this post"));
    }
    
    // Add the user's id to the likes array
    post.likes.push(userprofile[0]._id);;

    // Save the updated post
    await post.save();

    // Return a success response
    res.json(new ApiResponse(200, post, "Post liked successfully"));
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json(new ApiError(500, error, "Internal Server Error"));
  }
};


export { uploadPost, getAllPostsByHashtag, likePost };
  
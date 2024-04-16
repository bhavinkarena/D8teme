import {Post} from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserProfile } from "../models/userprofile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnS3 } from "../utils/s3.js";

const uploadPost = asyncHandler(async (req, res) => {
      const userId = req.user;
      const { hashtags } = req.body;
  
      // Upload the file on Cloudinary
      let post = req.files.post[0].path;
      const cloudinaryResponse = await uploadOnS3(post);
  
      if (!cloudinaryResponse) {
        return res.status(500).json(new ApiError(500, null, "Something went wrong while uploading the file"));
      }
      console.log(userId);
      // Create a new post object
      const newPost = new Post({
        userId: userId,
        hashtags: hashtags,
        post: cloudinaryResponse.Location, // save the Cloudinary URL of the uploaded file
      });
  
      // Save the new post object in the database
      await newPost.save();
  
      // Return a success response
      res.json(
        new ApiResponse(200, newPost, "Post Upload Successful 👍")
      );
});
  
const getAllPostsByHashtag = asyncHandler(async (req, res) => {
    const { hashtag } = req.body;

    // Find all posts with the specified hashtag
    const posts = await Post.find({ hashtags: hashtag });

    // Return the posts
    res.json(new ApiResponse(200, posts, "Posts Retrieved Successfully"));

});

const likePost = asyncHandler(async (req, res) => {
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
      // Remove the user's like
      post.likes = post.likes.filter(id => id.toString() !== userprofile[0]._id.toString());

      // Save the updated post
      await post.save();

      // Return a response indicating that the like has been removed
      return res.json(new ApiResponse(200, post, "Like removed"));
    }
    
    // Add the user's id to the likes array
    post.likes.push(userprofile[0]._id);;

    // Save the updated post
    await post.save();

    // Return a success response
    res.json(new ApiResponse(200, post, "Post liked successfully"));
});

const countLikes = asyncHandler(async (req, res) => {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json(new ApiError(404, null, "Post not found"));
    }

    // Return the number of likes
    res.json(new ApiResponse(200, { likesCount: post.likes.length }, "Likes counted"));

});

const countComment = asyncHandler(async (req, res) => {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json(new ApiError(404, null, "Post not found"));
    }

    // Return the number of likes
    res.json(new ApiResponse(200, { commentCount: post.comments.length }, "comments counted"));

});

export { uploadPost, getAllPostsByHashtag, likePost, countLikes, countComment };

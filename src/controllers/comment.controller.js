import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;    
    const { comment } = req.body;

    // Create a new comment object
    const newComment = new Comment({
      postId,
      comment,
      userId,
    });

    // Save the new comment object in the database
    await newComment.save();

    // Return a success response
    return res.status(201).json(
      new ApiResponse(200, newComment, "Comment created Successfully 👍")
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json(new ApiError(500, error, "Internal Server Error"));
  }
};

const createReply = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId } = req.user;    
      const { comment } = req.body;
  
      // Find the parent comment
      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        return res.status(400).json(new ApiError(400, "Parent comment not found"));
      }
  
      // Create a new comment object for the reply
      const newComment = new Comment({
        postId: parentComment.postId,
        comment,
        userId,
        parent_comment_id: commentId,
      });
  
      // Save the new comment object in the database
      await newComment.save();
  
      // Return a success response
      return res.status(201).json(
        new ApiResponse(200, newComment, "Comment Replay Successfully 👍")
      );
    } catch (error) {
      console.error("Error creating reply comment:", error);
      return res.status(500).json(new ApiError(500, error, "Internal Server Error"));
    }
};
  
export { createComment, createReply };

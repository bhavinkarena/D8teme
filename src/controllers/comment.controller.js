import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { UserProfile } from "../models/userprofile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    const { comment } = req.body;

    // Create a new comment object
    const newComment = new Comment({
      postId,
      comment,
      userId,
    });

    const post = await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    if (!post) {
      return res.status(404).json(new ApiError(404, null, "Post not found"));
    }

    // Save the new comment object in the database
    await newComment.save();

    // Return a success response
    return res
      .status(201)
      .json(
        new ApiResponse(200, newComment, "Comment created Successfully 👍")
      );
});

const createReply = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.user;
    const { comment } = req.body;

    // Find the parent comment
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res
        .status(404)
        .json(new ApiError(404, "Parent comment not found"));
    }

    // Create a new comment object for the reply
    const newComment = new Comment({
      postId: parentComment.postId,
      comment,
      userId,
      parent_comment_id: commentId,
    });

    const post = await Post.findByIdAndUpdate(parentComment.postId, {
      $push: { comments: newComment._id },
    });

    if (!post) {
      return res.status(404).json(new ApiError(404, null, "Post not found"));
    }
    // Save the new comment object in the database
    await newComment.save();

    // Return a success response
    return res
      .status(201)
      .json(new ApiResponse(200, newComment, "Comment Replay Successfully 👍"));

});

const likeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params; // Assuming postId is passed as a URL parameter
  const userId = req.user;

  const userprofile = await UserProfile.find({ userID: userId });
  console.log(commentId);
  // Find the post by postId
  const comment = await Comment.findById(commentId);
  console.log(comment);
  if (!comment) {
    return res.status(404).json(new ApiError(404, null, "Comment not found"));
  }

  // Check if the user has already liked the post
  if (comment.likes.includes(userprofile[0]._id)) {
    // Remove the user's like
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userprofile[0]._id.toString()
    );

    // Save the updated post
    await comment.save();

    // Return a response indicating that the like has been removed
    return res.json(new ApiResponse(200, comment, "Like removed"));
  }

  // Add the user's id to the likes array
  comment.likes.push(userprofile[0]._id);

  // Save the updated post
  await comment.save();

  // Return a success response
  res.json(new ApiResponse(200, comment, "Comment liked successfully"));
});

const countCommentLike = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;

    // Find the post by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json(new ApiError(404, null, "Comment not found"));
    }

    // Return the number of likes
    res.json(
      new ApiResponse(
        200,
        { likesCount: comment.likes.length },
        "Likes counted at comment"
      )
    );
});

export { createComment, createReply, likeComment, countCommentLike };

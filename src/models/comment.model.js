import mongoose, { Schema } from "mongoose";
// The User document has fields for email, accountId, name, and provider.
const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    parent_comment_id: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserProfile",
      }
    ]
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model("Comment", commentSchema);

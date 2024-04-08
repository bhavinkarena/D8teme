import mongoose, { Schema } from "mongoose";
// The User document has fields for email, accountId, name, and provider.
const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    post: {
      type: String,
    },
    hashtags: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserProfile",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ]
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", postSchema);

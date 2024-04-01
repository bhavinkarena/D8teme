import mongoose, { Schema } from "mongoose";
// The User document has fields for email, accountId, name, and provider.
const hashtagSchema = new Schema(
  {
    hashtag: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Hashtag = mongoose.model("Hashtag", hashtagSchema);

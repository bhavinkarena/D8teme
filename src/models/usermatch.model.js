import mongoose, { Schema } from "mongoose";
// The User document has fields for email, accountId, name, and provider.
const usermatchSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    isAccepted: {
      type: String,
      enum: ["Accept", "Reject", "Pending"],
      default:"Pending"
    },
  },
  {
    timestamps: true,
  }
);

export const userMatch = mongoose.model("userMatch", usermatchSchema);

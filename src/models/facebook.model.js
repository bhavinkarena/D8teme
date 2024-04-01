import mongoose,{Schema} from "mongoose";
// The User document has fields for email, accountId, name, and provider.
const facebookSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    accountId: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Facebook = mongoose.model("Facebook", facebookSchema);


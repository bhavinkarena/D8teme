import mongoose, { Schema } from "mongoose";

const userprofileSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    firstname: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    lastname: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    DOB: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Other"],
      require: true,
    },
    show_gender: {
      type: Boolean,
      default: false,
    },
    show_me: {
      type: String,
      enum: ["Men", "Women", "Other"],
      require: true,
    },
    looking_for: {
      type: String,
      enum: ["Men", "Women", "Other"],
      require: true,
    },
    profileImage: [
      {
        type: String,
        require: true,
      },
    ],
    Passions: [
      {
        type: String,
        require: true,
      },
    ],
    Sexuality: {
      type: String,
      enum: ["Men", "Women", "Other"],
    },
  },
  {
    timestamps: true,
  }
);

export const UserProfile = mongoose.model("UserProfile", userprofileSchema);

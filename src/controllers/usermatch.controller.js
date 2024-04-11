import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { userMatch } from "../models/usermatch.model.js";
import { UserProfile } from "../models/userprofile.model.js";
import mongoose from "mongoose";

const sendRequest = asyncHandler(async (req, res) => {
  const { recipientId } = req.body;
  const senderId = await UserProfile.find({ userID: req.user._id });
  try {
    const sender = await UserProfile.findById(senderId[0]._id);
    const recipient = await UserProfile.find({ userID: recipientId });
    if (
      !sender ||
      !recipient ||
      senderId[0]._id.toString() === recipientId.toString()
    ) {
      console.log("if");
      return res.status(404).json(new ApiError(404, null, "User not found"));
    }
    //check if user is alreddy friend or not
    if (sender.friends.includes(recipientId)) {
      console.log("object");
      return res.json(new ApiResponse(200, null, "User is already a friend"));
    }
    // Check if a request has already been sent
    const existingRequest = await userMatch.findOne({
      senderId: new mongoose.Types.ObjectId(senderId[0]._id),
      recipientId: new mongoose.Types.ObjectId(recipient[0]._id),
    });
    if (existingRequest) {
      return res.json(
        new ApiResponse(200, null, "Friend request already sent")
      );
    }
    const newMatch = await userMatch.create({
      senderId: new mongoose.Types.ObjectId(senderId[0]._id),
      recipientId: new mongoose.Types.ObjectId(recipient[0]._id),
      isAccepted: "Pending",
    });
    const matchUser = await userMatch.findById(newMatch._id).select();
    res.json(
      new ApiResponse(200, matchUser, "Friend request sent successfully")
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(new ApiError(500, null, "Internal server error"));
  }
});

const acceptRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.body; // Assuming requestId is the ID of the friend request to be accepted
  const recipientId = await UserProfile.find({ userID: req.user._id });
  try {
    // Find the friend request by ID
    const friendRequest = await userMatch.findById(requestId);
    if (!friendRequest) {
      return res
        .status(404)
        .json(new ApiError(404, null, "Friend request not found"));
    }
    console.log(friendRequest.recipientId.toString());
    console.log(recipientId[0]._id.toString());
    // Check if the recipient is the intended recipient of the request
    if (
      friendRequest.recipientId.toString() !== recipientId[0]._id.toString()
    ) {
      return res
        .status(403)
        .json(
          new ApiError(
            403,
            null,
            "You are not authorized to accept this request"
          )
        );
    }

    // Update the friend request status to accepted
    friendRequest.isAccepted = "Accept";
    await friendRequest.save();

    // Update the sender's and recipient's friend lists
    const sender = await UserProfile.findById(friendRequest.senderId);
    const recipient = await UserProfile.findById(friendRequest.recipientId);
    if (!sender || !recipient) {
      return res.status(404).json(new ApiError(404, null, "User not found"));
    }
    sender.friends.push(recipientId[0]._id.toString());
    recipient.friends.push(sender._id.toString());
    await sender.save();
    await recipient.save();

    res.json(
      new ApiResponse(200, null, "Friend request accepted successfully")
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(new ApiError(500, null, "Internal server error"));
  }
});

const rejectRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.body; // Assuming requestId is the ID of the friend request to be accepted
  const recipientId = await UserProfile.find({ userID: req.user._id });
  try {
    // Find the friend request by ID
    const friendRequest = await userMatch.findById(requestId);
    if (!friendRequest) {
      return res
        .status(404)
        .json(new ApiError(404, null, "Friend request not found"));
    }
    console.log(friendRequest.recipientId.toString());
    console.log(recipientId[0]._id.toString());
    // Check if the recipient is the intended recipient of the request
    if (
      friendRequest.recipientId.toString() !== recipientId[0]._id.toString()
    ) {
      return res
        .status(403)
        .json(
          new ApiError(
            403,
            null,
            "You are not authorized to accept this request"
          )
        );
    }

    // delete friend request
    if ((friendRequest.isAccepted = "Pending")) {
      await userMatch.deleteOne({ _id: requestId });
    } else {
      return res
        .status(409)
        .json(new ApiError(409, null, "friend request is alreddy accepted"));
    }

    res.json(
      new ApiResponse(200, null, "Friend request rejected successfully")
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(new ApiError(500, null, "Internal server error"));
  }
});

const getFriendsList = asyncHandler(async (req, res) => {
  try {
    // Find the user by ID
    const user = await UserProfile.find({ userID: req.user._id });
    if (!user) {
      return res.status(404).json(new ApiError(404, null, "User not found"));
    }

    // Find the user's friends
    const friendIds = user[0].friends;
    console.log(friendIds);
    const friends = await UserProfile.find({ _id: { $in: friendIds } }).select(
      "firstname lastname DOB profileImage gender last_online_time height body_type bio_video_url bio_content"
    );

    res.json(
      new ApiResponse(200, friends, "Friends list retrieved successfully")
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(new ApiError(500, null, "Internal server error"));
  }
});

const getPendingList = asyncHandler(async (req, res) => {
  const userId = await UserProfile.find({ userID: req.user._id });
  try {
    // Find pending requests where the recipientId matches the userId
    const pendingRequests = await userMatch
      .find({
        recipientId: userId[0]._id,
        isAccepted: "Pending",
      })
      .populate({
        path: "senderId",
        select:
          "-_id -profileImage -userID -friends -email -show_me -member_status -height_verification -last_online_time -height_verification",
      });

    res.json(
      new ApiResponse(
        200,
        pendingRequests,
        "Pending requests list retrieved successfully"
      )
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(new ApiError(500, null, "Internal server error"));
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { blockId } = req.body;
  const userId = await UserProfile.find({ userID: req.user._id });
  try {
    // Find the user to unfollow and the follower
    const userToUnfollow = await UserProfile.findById(blockId);
    const follower = await UserProfile.findById(userId[0]._id);
    if (!userToUnfollow || !follower) {
      return res.status(404).json(new ApiError(404, null, "User not found"));
    }
    console.log(userId[0]._id.toString());
    console.log(userToUnfollow._id.toString());
    // Remove the ID of the user to unfollow from the follower's friend array
    follower.friends.pull(userToUnfollow._id);
    console.log(follower.friends);
    // Remove the ID of the follower from the user to unfollow's friend array
    userToUnfollow.friends.pull(userId[0]._id);

    // Save the updated profiles
    await follower.save();
    await userToUnfollow.save();

    res.json(new ApiResponse(200, follower, "User unfollowed successfully"));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(new ApiError(500, null, "Internal server error"));
  }
});

export {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getFriendsList,
  getPendingList,
  blockUser,
};

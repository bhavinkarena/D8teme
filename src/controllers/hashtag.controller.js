import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Hashtag } from "../models/hashtag.model.js";

const addHashtag = asyncHandler(async (req, res) => {
  const { hashtag, type } = req.body;

  const existedHash = await Hashtag.findOne({ hashtag, type });
  if (existedHash) {
    return res.status(409).json(new ApiError(409, null, "This hashtag already exists"));
  }

  const newHashtag = await Hashtag.create({ hashtag, type });
  if (!newHashtag) {
    return res.status(500).json(new ApiError(500, null, "Something went wrong while adding the hashtag"));
  }

  return res
    .status(201)
    .json(new ApiResponse(200, newHashtag, "Hashtag added successfully"));
});

const getAllPostHashtag = asyncHandler(async (req, res) => {
  const postHashtags = await Hashtag.find({ type: "post" }).select(
    "hashtag -_id"
  );
  let post_array = [];
  for (let i = 0; i < postHashtags.length; i++) {
    post_array.push(postHashtags[i].hashtag);
  }
  return res.json(post_array);
});

const getAllPassionHashtag = asyncHandler(async (req, res) => {
  const userHashtags = await Hashtag.find({ type: "passion" }).select(
    "hashtag -_id"
  );
  let passion_array = [];
  for (let i = 0; i < userHashtags.length; i++) {
    passion_array.push(userHashtags[i].hashtag);
  }
  return res.json(passion_array);
});

// const addDefaultHashtags = asyncHandler(async (req, res) => {
//   const hashtags = [
//     "#relationshipgoals", "#couplegoals", "#love", "#partnership", "#bff", "#family",
//     "#motherhood", "#fatherhood", "#parenting", "#marriage", "#engagement", "#wedding",
//     "#dating", "#longdistancerelationships", "#friendship", "#companionship", "#teamwork",
//     "#supportsystem", "#soulmates", "#videooftheday", "#picoftheday", "#beautiful", "#beauty",
//     "#happy", "#art", "#smile", "#fashion", "#nature", "#cute", "#hot", "#selfie", "#travel",
//     "#friends", "#fun", "#style", "#fit", "#exercise", "#gym", "#work"
//   ];

//   const existingHashtags = await Hashtag.find({ hashtag: { $in: hashtags } });
//   const existingHashtagNames = existingHashtags.map((hash) => hash.hashtag);

//   const newHashtags = hashtags.filter((hash) => !existingHashtagNames.includes(hash));

//   const createdHashtags = await Hashtag.create(newHashtags.map((hash) => ({ hashtag: hash, type: "post" })));

//   return res.json(createdHashtags);
// });

// const addDefaultHashtags = asyncHandler(async (req, res) => {
//   const hashtags = [
//     "#hiking", "#gardening", "#painting", "#photography", "#cooking", "#nightout",
//     "#livemusic", "#music", "#restaurants", "#simplethings", "#drawing", "#woodworking",
//     "#fishing", "#homeimprovement", "#writing", "#reading", "#relaxation", "#yoga",
//     "#cycling", "#running", "#swimming", "#surfing", "#scubadiving", "#nature", "#kids",
//     "#livinglife", "#success", "#petlovers", "#innovative", "#lifeisaboutlaughs",
//     "#nobullshit", "#therealme", "#catlover", "#doglover", "#livelife", "#fearless",
//     "#strong", "#fetishes", "#sports", "#football", "#baseball", "#basketball",
//     "#business", "#fitness", "#bethebestyou", "#openrelationship", "#single", "#married",
//     "#love", "#open", "#women", "#men", "#menandwomen", "#family", "#wine", "#skydiving",
//     "#inthemoment", "#active", "#pottery", "#sculpture", "#calligraphy", "#modelmaking",
//     "#astronomy", "#rockclimbing", "#kayaking", "#skateboarding", "#snowboarding",
//     "#skiing", "#gaming", "#musicproduction", "#dancing", "#acting", "#cosplay",
//     "#virtualreality", "#dating", "#personality", "#dominant", "#submissive", "#equal",
//     "#traditional", "#modern", "#musician", "#leader", "#dreamer", "#organized",
//     "#openminded", "#cigar", "#supportive", "#golf", "#boating", "#yacht", "#sailing",
//     "#fun", "#easygoing", "#life"
//   ];

//   const existingHashtags = await Hashtag.find({ hashtag: { $in: hashtags } });
//   const existingHashtagNames = existingHashtags.map((hash) => hash.hashtag);

//   const newHashtags = hashtags.filter((hash) => !existingHashtagNames.includes(hash));

//   const createdHashtags = await Hashtag.create(newHashtags.map((hash) => ({ hashtag: hash, type: "passion" })));

//   return res.json(createdHashtags);
// });

export { addHashtag, getAllPostHashtag, getAllPassionHashtag };

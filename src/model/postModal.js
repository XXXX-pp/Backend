import { Schema, model } from "mongoose";

const mediaSchema = new Schema({
  src: String,
  noOfLikes: Number,
  likedby: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const postSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  description: {
    type: String,
    required: true,
  },

  media1: [mediaSchema],
  media2: [mediaSchema],

  timestamps: true,
});

export const PostModel = model("Post", postSchema);

import { Schema, model } from "mongoose";

const postSchema = new Schema({
  user: {
    type: String,
    required: true,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
  },
  firstImageLink:{
    type: String,
    required: true,
  },
  secondImageLink:{
    type: String,
    required: true,
  },
  likes:{
    type: String,
  },
  postId:{
    type: String,
  },
},{  timestamps: true});

export const PostModel = model("Post", postSchema);

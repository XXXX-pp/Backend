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
  firstImage:{
    type: Object,
    required: true,
  },
  secondImage:{
    type: Object,
    required: true,
  },
  likes:{
    type: Number,
  },
  postId:{
    type: String,
  },
},{  timestamps: true});

postSchema.pre('save', function(next) {
  this.likes = (this.firstImage.likes || 0) + (this.secondImage.likes || 0);
  next();
});

export const PostModel = model("Post", postSchema);

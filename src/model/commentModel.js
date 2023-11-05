import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    postId: {
        type: String,
        required: true,
        ref: 'post'
    },
    comments: {
        type: Array,
        required: true
    }
})

export const CommentModel = model("Comment", commentSchema);
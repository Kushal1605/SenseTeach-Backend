import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    meeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
